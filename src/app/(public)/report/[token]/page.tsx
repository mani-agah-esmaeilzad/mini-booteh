import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { ShareLinkButton } from "@/components/report/share-link";
import { RiskGauge } from "@/components/report/risk-gauge";
import { SubscaleChart } from "@/components/report/subscale-chart";
import { FocusDistributionChart } from "@/components/report/focus-distribution-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildReactionDistribution, type FocusMetrics } from "@/lib/focus";
import { prisma } from "@/lib/prisma";
import { calculateSubscales, type TotalsPayload } from "@/lib/scoring";
import { texts } from "@/lib/texts/fa";
import { formatDate, toPersianDigits } from "@/lib/i18n/format";

export default async function ReportPage({
  params,
}: {
  params: { token: string };
}) {
  const session = await prisma.assessmentSession.findFirst({
    where: {
      OR: [{ shareToken: params.token }, { id: params.token }],
    },
    include: {
      questionnaire: {
        include: {
          scoring: true,
          questions: true,
        },
      },
      report: true,
      focusRuns: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
  if (!session) {
    notFound();
  }
  let totals = session.totalsJson as TotalsPayload | null;
  if (!totals) {
    const answers = await prisma.answer.findMany({ where: { sessionId: session.id } });
    totals = calculateSubscales({
      answers,
      scoringRules: session.questionnaire.scoring,
    });
  }
  const focusMetrics = session.focusTotalsJson as FocusMetrics | null;
  const focusEvents = (session.focusRuns[0]?.resultsJson as { events?: { reacted?: boolean; reactionTimeMs?: number; responded?: boolean }[] } | null)
    ?.events ?? [];
  const distribution = buildReactionDistribution(
    focusEvents
      .filter((event) => event.responded && typeof event.reactionTimeMs === "number")
      .map((event) => event.reactionTimeMs ?? 0),
  );
  const headerStore = await headers();
  const origin =
    headerStore.get("x-forwarded-proto") && headerStore.get("x-forwarded-host")
      ? `${headerStore.get("x-forwarded-proto")}://${headerStore.get("x-forwarded-host")}`
      : process.env.NEXT_PUBLIC_APP_URL;
  const shareUrl =
    session.shareToken && origin ? `${origin}/report/${session.shareToken}` : undefined;

  const riskLabel = session.riskBand ?? texts.report.pendingRisk;
  return (
    <div className="container space-y-8 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="outline">{texts.report.badge}</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{texts.report.title}</h1>
          <p className="text-sm text-muted-foreground">
            {texts.report.completedAt(formatDate(session.completedAt ?? session.createdAt))} · #
            {toPersianDigits(session.id.slice(0, 8))}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <a href={`/api/reports/${session.id}/pdf`} target="_blank" rel="noreferrer">
              {texts.report.downloadPdf}
            </a>
          </Button>
          {session.shareToken ? (
            <ShareLinkButton
              url={
                shareUrl ??
                `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/report/${session.shareToken}`
              }
            />
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{texts.report.questionnaireCard}</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscaleChart data={totals.subscales} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{texts.report.riskCard}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <RiskGauge score={totals.overallScore} label={riskLabel} />
            <div className="w-full space-y-3">
              {totals.subscales.map((subscale) => (
                <div key={subscale.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{subscale.name}</span>
                  <span>{toPersianDigits(subscale.rawScore.toFixed(1))}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {focusMetrics ? (
        <Card>
          <CardHeader>
            <CardTitle>{texts.report.focusCard}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2 text-sm">
              <p>دقت: {toPersianDigits(focusMetrics.accuracy)}٪</p>
              <p>میانگین واکنش: {toPersianDigits(focusMetrics.reactionAvgMs)} میلی‌ثانیه</p>
              <p>نوسان واکنش: {toPersianDigits(focusMetrics.reactionStdMs)} میلی‌ثانیه</p>
              <p>خطای انجام: {toPersianDigits(focusMetrics.commissionErrors ?? 0)}</p>
              <p>خطای حذف: {toPersianDigits(focusMetrics.omissionErrors ?? 0)}</p>
            </div>
            <FocusDistributionChart data={distribution} />
          </CardContent>
        </Card>
      ) : null}

        <Card>
          <CardHeader>
            <CardTitle>{texts.report.narrativeCard}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none dark:prose-invert">
            {session.report?.narrativeMd ? (
              <ReactMarkdown>{session.report.narrativeMd}</ReactMarkdown>
            ) : (
              <p className="text-sm text-muted-foreground">{texts.report.missingNarrative}</p>
            )}
          </CardContent>
        </Card>

      <Card>
        <CardHeader>
          <CardTitle>{texts.report.disclaimerTitle}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{texts.report.disclaimerBody}</CardContent>
      </Card>
    </div>
  );
}
