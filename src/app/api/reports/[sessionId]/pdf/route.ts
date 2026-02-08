import { NextResponse } from "next/server";

import type { FocusMetrics } from "@/lib/focus";
import { generateReportPdf } from "@/lib/pdf/report";
import { prisma } from "@/lib/prisma";
import { getAppSettings } from "@/lib/settings";
import type { TotalsPayload } from "@/lib/scoring";
import { texts } from "@/lib/texts/fa";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await context.params;
  const session = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
    include: { report: true },
  });
  if (!session) {
    return NextResponse.json({ error: "نشست موردنظر پیدا نشد." }, { status: 404 });
  }
  const settings = await getAppSettings();
  const totals = session.totalsJson as TotalsPayload | null;
  if (!totals) {
    return NextResponse.json(
      { error: "گزارش هنوز ساخته نشده است." },
      { status: 400 },
    );
  }
  const focusMetrics = session.focusTotalsJson as FocusMetrics | undefined;
  const pdf = await generateReportPdf({
    narrative: session.report?.narrativeMd ?? texts.report.missingNarrative,
    totals,
    focusMetrics,
    disclaimer: settings.disclaimerText,
    riskBand: session.riskBand ?? undefined,
  });
  return new NextResponse(pdf as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="focus-report-${session.id}.pdf"`,
    },
  });
}
