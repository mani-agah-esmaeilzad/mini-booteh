import { NextResponse } from "next/server"
import { z } from "zod"

import { chatWithAvalAi, type ChatMessage } from "@/lib/ai/avalai"
import { prisma } from "@/lib/prisma"
import { enforceRateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
})

const chatSchema = z.object({
  messages: z.array(messageSchema).min(1),
  finalize: z.boolean().optional(),
})

const scoreSchema = z.object({
  summary: z.string().min(1),
  riskBand: z.object({
    label: z.enum(["پایین", "متوسط", "بالا"]),
    description: z.string().min(1),
  }),
  scores: z.object({
    attention_sustained: z.number().min(0).max(100),
    impulsivity: z.number().min(0).max(100),
    working_memory: z.number().min(0).max(100),
    emotion_regulation: z.number().min(0).max(100),
    organization: z.number().min(0).max(100),
  }),
})

const CHAT_SYSTEM_PROMPT = `
تو یک دستیار مصاحبه‌گر فارسی برای غربالگری غیرتشخیصی تمرکز و توجه هستی.
هدف تو این است که در یک گفت‌وگوی کوتاه (حدود ۶ تا ۱۰ سؤال) اطلاعات لازم را جمع‌آوری کنی.
قواعد:
- هر بار فقط یک سؤال کوتاه بپرس.
- با توجه به پاسخ کاربر، سؤال بعدی را تنظیم کن و پیگیری داشته باش.
- لحن همدلانه و بی‌طرف داشته باش.
- از ارائه تشخیص پزشکی خودداری کن.
- در پایان می‌توانی بپرسی آیا آماده ورود به مرحله بعد (آزمون تمرکز) است.
`

const FINALIZE_SYSTEM_PROMPT = `
تو باید بر اساس گفت‌وگوی انجام‌شده یک جمع‌بندی و نمره‌های غربالگری تولید کنی.
خروجی فقط و فقط JSON معتبر باشد و هیچ متن دیگری ننویس.
اسکیما:
{
  "summary": "خلاصه کوتاه فارسی",
  "riskBand": { "label": "پایین|متوسط|بالا", "description": "توضیح کوتاه فارسی" },
  "scores": {
    "attention_sustained": عدد بین 0 تا 100,
    "impulsivity": عدد بین 0 تا 100,
    "working_memory": عدد بین 0 تا 100,
    "emotion_regulation": عدد بین 0 تا 100,
    "organization": عدد بین 0 تا 100
  }
}
قواعد:
- همه اعداد بین 0 تا 100 باشند.
- label فقط یکی از این‌ها باشد: "پایین"، "متوسط"، "بالا".
- خروجی فقط JSON باشد، بدون کدبلاک.
`

function extractJson(content: string) {
  const start = content.indexOf("{")
  const end = content.lastIndexOf("}")
  if (start === -1 || end === -1 || end <= start) {
    return null
  }
  try {
    return JSON.parse(content.slice(start, end + 1))
  } catch {
    return null
  }
}

function buildTotals(scores: z.infer<typeof scoreSchema>["scores"]) {
  const subscales = [
    { id: "attention_sustained", name: "توجه پایدار", value: scores.attention_sustained },
    { id: "impulsivity", name: "تکانش‌گری", value: scores.impulsivity },
    { id: "working_memory", name: "حافظه کاری", value: scores.working_memory },
    { id: "emotion_regulation", name: "تنظیم هیجان", value: scores.emotion_regulation },
    { id: "organization", name: "سازماندهی", value: scores.organization },
  ]
  const overallScore =
    subscales.reduce((acc, item) => acc + item.value, 0) / Math.max(1, subscales.length)
  return {
    subscales: subscales.map((item) => ({
      id: item.id,
      name: item.name,
      rawScore: Number(item.value.toFixed(1)),
      normalizedScore: Number(item.value.toFixed(1)),
      method: "average" as const,
    })),
    overallScore: Number(overallScore.toFixed(1)),
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await context.params
  const json = await request.json()
  const parsed = chatSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: "داده‌های ارسال‌شده معتبر نیست." }, { status: 400 })
  }

  const session = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
  })
  if (!session) {
    return NextResponse.json({ error: "نشست یافت نشد." }, { status: 404 })
  }

  const limiter = enforceRateLimit({
    key: parsed.data.finalize ? `chat-final:${sessionId}` : `chat:${sessionId}`,
    intervalMs: parsed.data.finalize ? 10 * 60 * 1000 : 2 * 60 * 1000,
    limit: parsed.data.finalize ? 5 : 30,
  })
  if (!limiter.success) {
    return NextResponse.json(
      { error: "درخواست‌های پیاپی زیاد است. چند دقیقه بعد دوباره تلاش کن." },
      { status: 429 },
    )
  }

  try {
    if (parsed.data.finalize) {
      const completion = await chatWithAvalAi({
        messages: parsed.data.messages as ChatMessage[],
        systemPrompt: FINALIZE_SYSTEM_PROMPT,
        temperature: 0.2,
      })
      const jsonPayload = extractJson(completion.content)
      const scored = jsonPayload ? scoreSchema.safeParse(jsonPayload) : null
      if (!scored?.success) {
        return NextResponse.json(
          { error: "نتیجه گفتگو قابل پردازش نیست. دوباره تلاش کن." },
          { status: 502 },
        )
      }
      const totals = buildTotals(scored.data.scores)
      await prisma.assessmentSession.update({
        where: { id: session.id },
        data: {
          totalsJson: totals,
          riskBand: scored.data.riskBand.label,
          updatedAt: new Date(),
        },
      })
      return NextResponse.json({
        ok: true,
        reply: scored.data.summary,
        assessment: {
          totals,
          riskBand: scored.data.riskBand,
        },
      })
    }

    const response = await chatWithAvalAi({
      messages: parsed.data.messages as ChatMessage[],
      systemPrompt: CHAT_SYSTEM_PROMPT,
      temperature: 0.6,
    })

    return NextResponse.json({ ok: true, reply: response.content })
  } catch (error) {
    console.error("AvalAI chat error", error)
    return NextResponse.json(
      { error: "ارتباط با هوش مصنوعی برقرار نشد. دوباره تلاش کن." },
      { status: 502 },
    )
  }
}
