import { Metadata } from "next";
import { notFound } from "next/navigation";

import { AssessmentFlow } from "@/components/assessment/assessment-flow";
import { prisma } from "@/lib/prisma";
import { getAppSettings, getFocusTestSettings } from "@/lib/settings";
import { texts } from "@/lib/texts/fa";

export const metadata: Metadata = {
  title: `${texts.brand} | جریان ارزیابی`,
  description: texts.seo.description,
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string }>;
}) {
  const resolvedParams = await searchParams;
  const sessionId = resolvedParams.sessionId;
  if (!sessionId) {
    notFound();
  }
  const session = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
    select: { id: true },
  });
  if (!session) {
    notFound();
  }
  const [focusSettings, appSettings] = await Promise.all([
    getFocusTestSettings(),
    getAppSettings(),
  ]);
  const focusConfig = {
    durationSeconds: focusSettings.durationSeconds,
    symbolFrequencyMs: focusSettings.symbolFrequencyMs,
    targetRatio: focusSettings.targetRatio,
    targetSymbol: focusSettings.targetSymbol,
    nonTargetSymbol: focusSettings.nonTargetSymbol,
  };
  return (
    <div className="container py-12">
      <AssessmentFlow
        sessionId={session.id}
        focusSettings={focusConfig}
        focusOptional={appSettings.focusTestOptional}
      />
    </div>
  );
}
