import type { FocusRun, PromptTemplate } from "@prisma/client";

import { generateReportNarrative } from "@/lib/ai/avalai";
import type { FocusMetrics } from "@/lib/focus";
import { prisma } from "@/lib/prisma";
import { determineRiskBand, calculateSubscales } from "@/lib/scoring";
import { getAppSettings } from "@/lib/settings";

export async function loadSessionDetail(sessionId: string) {
  return prisma.assessmentSession.findUnique({
    where: { id: sessionId },
    include: {
      questionnaire: {
        include: {
          scoring: true,
          questions: true,
        },
      },
      answers: true,
      focusRuns: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      report: {
        include: {
          promptTemplate: true,
        },
      },
    },
  });
}

function parseFocusMetrics(focusRun?: FocusRun | null) {
  if (!focusRun?.resultsJson) {
    return undefined;
  }
  const payload = focusRun.resultsJson as FocusMetrics & {
    events?: unknown[];
  };
  return {
    accuracy: focusRun.accuracy ?? payload.accuracy ?? 0,
    reactionAvgMs: focusRun.reactionAvgMs ?? payload.reactionAvgMs ?? 0,
    reactionStdMs: focusRun.reactionStdMs ?? payload.reactionStdMs ?? 0,
    commissionErrors: focusRun.commission ?? payload.commissionErrors ?? 0,
    omissionErrors: focusRun.omission ?? payload.omissionErrors ?? 0,
    totalTargets: payload.totalTargets ?? 0,
    totalResponses: payload.totalResponses ?? 0,
  } satisfies FocusMetrics;
}

export async function composeReport({
  sessionId,
  promptTemplate,
}: {
  sessionId: string;
  promptTemplate?: PromptTemplate;
}) {
  const [session, settings] = await Promise.all([
    loadSessionDetail(sessionId),
    getAppSettings(),
  ]);
  if (!session) {
    throw new Error("نشست پیدا نشد.");
  }
  const totals = calculateSubscales({
    answers: session.answers,
    scoringRules: session.questionnaire.scoring,
  });
  const riskBand = determineRiskBand({
    totals,
  });
  const focusMetrics = parseFocusMetrics(session.focusRuns[0]);
  const template =
    promptTemplate ??
    (await prisma.promptTemplate.findFirst({
      where: { isActive: true },
      orderBy: { version: "desc" },
    }));
  if (!template) {
    throw new Error("هیچ الگوی فعالی برای روایت تعریف نشده است.");
  }
  const response = await generateReportNarrative({
    promptTemplate: template,
    totals,
    focusMetrics,
    disclaimer: settings.disclaimerText,
    language: session.language ?? settings.defaultLanguage ?? "fa",
    riskBand: riskBand?.label,
  });
  const report = await prisma.report.upsert({
    where: { sessionId },
    create: {
      sessionId,
      promptTemplateId: template.id,
      narrativeMd: response.content,
      modelInfoJson: response.usage ?? undefined,
    },
    update: {
      promptTemplateId: template.id,
      narrativeMd: response.content,
      modelInfoJson: response.usage ?? undefined,
      generatedAt: new Date(),
    },
  });
  await prisma.assessmentSession.update({
    where: { id: sessionId },
    data: {
      riskBand: riskBand?.label,
      totalsJson: totals,
      focusTotalsJson: focusMetrics,
      promptVersion: template.version,
      status: "COMPLETE",
      completedAt: session.completedAt ?? new Date(),
    },
  });
  return {
    report,
    totals,
    focusMetrics,
    riskBand,
    promptTemplate: template,
  };
}
