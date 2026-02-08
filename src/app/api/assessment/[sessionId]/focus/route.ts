import { NextResponse } from "next/server";

import { evaluateFocusRun } from "@/lib/focus";
import { prisma } from "@/lib/prisma";
import { focusPayloadSchema } from "@/lib/validators/assessment";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await context.params;
  const json = await request.json();
  const parsed = focusPayloadSchema.safeParse({
    ...json,
    sessionId,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "اطلاعات آزمون تمرکز معتبر نیست." }, { status: 400 });
  }

  const session = await prisma.assessmentSession.findUnique({
    where: { id: parsed.data.sessionId },
  });
  if (!session) {
    return NextResponse.json({ error: "نشست موردنظر پیدا نشد." }, { status: 404 });
  }

  const metrics = evaluateFocusRun(parsed.data.events);

  const focusRun = await prisma.focusRun.create({
    data: {
      sessionId: session.id,
      durationMs: parsed.data.durationMs,
      accuracy: metrics.accuracy,
      reactionAvgMs: metrics.reactionAvgMs,
      reactionStdMs: metrics.reactionStdMs,
      commission: metrics.commissionErrors,
      omission: metrics.omissionErrors,
      resultsJson: { events: parsed.data.events, ...metrics },
    },
  });

  await prisma.assessmentSession.update({
    where: { id: session.id },
    data: {
      focusTotalsJson: {
        accuracy: metrics.accuracy,
        reactionAvgMs: metrics.reactionAvgMs,
        reactionStdMs: metrics.reactionStdMs,
        commissionErrors: metrics.commissionErrors,
        omissionErrors: metrics.omissionErrors,
        totalTargets: metrics.totalTargets,
        totalResponses: metrics.totalResponses,
      },
    },
  });

  return NextResponse.json({ ok: true, focusRunId: focusRun.id, metrics });
}
