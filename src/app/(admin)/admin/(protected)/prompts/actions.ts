"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { recordAuditLog } from "@/lib/audit";
import { generateReportNarrative } from "@/lib/ai/avalai";
import { prisma } from "@/lib/prisma";
import { calculateSubscales, type TotalsPayload } from "@/lib/scoring";
import { getAppSettings } from "@/lib/settings";
import { upsertPromptSchema, promptPreviewSchema } from "@/lib/validators/admin";

export async function upsertPromptAction(formData: FormData) {
  const parsed = upsertPromptSchema.safeParse({
    name: formData.get("name"),
    systemPrompt: formData.get("systemPrompt"),
    userTemplate: formData.get("userTemplate"),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) {
    throw new Error("داده‌های الگو معتبر نیست.");
  }
  const latest = await prisma.promptTemplate.findFirst({
    where: { name: parsed.data.name },
    orderBy: { version: "desc" },
  });
  const prompt = await prisma.promptTemplate.create({
    data: {
      name: parsed.data.name,
      systemPrompt: parsed.data.systemPrompt,
      userTemplate: parsed.data.userTemplate,
      version: (latest?.version ?? 0) + 1,
      isActive: parsed.data.isActive ?? false,
    },
  });
  if (parsed.data.isActive) {
    await prisma.promptTemplate.updateMany({
      where: { id: { not: prompt.id } },
      data: { isActive: false },
    });
  }
  const session = await auth();
  await recordAuditLog({
    adminId: session?.user.id,
    action: "PROMPT_VERSION_CREATED",
    metadata: { promptId: prompt.id },
  });
  revalidatePath("/admin/prompts");
  return;
}

export async function setActivePromptAction(formData: FormData) {
  const id = formData.get("promptId")?.toString();
  if (!id) {
    throw new Error("شناسه الگو وارد نشده است.");
  }
  await prisma.promptTemplate.updateMany({
    data: { isActive: false },
  });
  await prisma.promptTemplate.update({
    where: { id },
    data: { isActive: true },
  });
  const session = await auth();
  await recordAuditLog({
    adminId: session?.user.id,
    action: "PROMPT_ACTIVATED",
    metadata: { promptId: id },
  });
  revalidatePath("/admin/prompts");
  return;
}

export async function previewPromptAction(_: unknown, formData: FormData) {
  const parsed = promptPreviewSchema.safeParse({
    sessionId: formData.get("sessionId"),
    promptTemplateId: formData.get("promptTemplateId"),
  });
  if (!parsed.success) {
    return { error: "پیش‌نمایش درخواستی معتبر نیست." };
  }
  const [session, template, appSettings] = await Promise.all([
    prisma.assessmentSession.findUnique({
      where: { id: parsed.data.sessionId },
      include: {
        questionnaire: {
          include: {
            scoring: true,
          },
        },
        answers: true,
        focusRuns: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),
    prisma.promptTemplate.findUnique({ where: { id: parsed.data.promptTemplateId } }),
    getAppSettings(),
  ]);
  if (!session || !template) {
    return { error: "نشست یا الگو یافت نشد." };
  }
  const totals =
    (session.totalsJson as TotalsPayload | null) ??
    calculateSubscales({
      answers: session.answers,
      scoringRules: session.questionnaire.scoring,
    });
  const normalizedFocus =
    (session.focusTotalsJson && typeof session.focusTotalsJson === "object"
      ? (session.focusTotalsJson as Record<string, unknown>)
      : undefined) ??
    (session.focusRuns[0]?.resultsJson && typeof session.focusRuns[0]?.resultsJson === "object"
      ? (session.focusRuns[0]?.resultsJson as Record<string, unknown>)
      : undefined);
  const narrative = await generateReportNarrative({
    promptTemplate: template,
    totals,
    focusMetrics: normalizedFocus,
    disclaimer: appSettings.disclaimerText,
    language: session.language,
    riskBand: session.riskBand ?? undefined,
  });
  return { preview: narrative.content };
}
