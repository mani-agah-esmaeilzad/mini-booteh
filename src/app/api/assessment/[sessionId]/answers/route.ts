import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { answerSchema } from "@/lib/validators/assessment";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await context.params;
  const json = await request.json();
  const parsed = answerSchema.safeParse({
    sessionId,
    answers: json.answers,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "داده‌های ارسال‌شده معتبر نیست." }, { status: 400 });
  }

  const session = await prisma.assessmentSession.findUnique({
    where: { id: parsed.data.sessionId },
    include: {
      questionnaire: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!session) {
    return NextResponse.json({ error: "نشست پیدا نشد." }, { status: 404 });
  }

  const questionIds = new Set(
    (
      await prisma.question.findMany({
        where: { questionnaireId: session.questionnaireId },
        select: { id: true },
      })
    ).map((q) => q.id),
  );
  const invalid = parsed.data.answers.some((answer) => !questionIds.has(answer.questionId));
  if (invalid) {
    return NextResponse.json({ error: "سؤالات ارسال‌شده با فرم فعلی همخوانی ندارد." }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.answer.deleteMany({ where: { sessionId: session.id } });
    await tx.answer.createMany({
      data: parsed.data.answers.map((answer) => ({
        sessionId: session.id,
        questionId: answer.questionId,
        valueNumber: answer.value,
      })),
    });
    await tx.assessmentSession.update({
      where: { id: session.id },
      data: { updatedAt: new Date() },
    });
  });

  return NextResponse.json({ ok: true });
}
