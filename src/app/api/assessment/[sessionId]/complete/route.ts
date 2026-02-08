import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { composeReport } from "@/lib/reporting";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  context: { params: Promise<{ sessionId: string }> },
) {
  const { sessionId } = await context.params;
  const session = await prisma.assessmentSession.findUnique({
    where: { id: sessionId },
  });
  if (!session) {
    return NextResponse.json({ error: "نشست یافت نشد." }, { status: 404 });
  }

  const limiter = enforceRateLimit({
    key: `report:${session.id}`,
    intervalMs: 15 * 60 * 1000,
    limit: 3,
  });

  if (!limiter.success) {
    return NextResponse.json(
      { error: "درخواست‌های پیاپی زیاد است. چند دقیقه بعد دوباره تلاش کن." },
      { status: 429 },
    );
  }

  try {
    const { report, totals, focusMetrics, riskBand } = await composeReport({
      sessionId: session.id,
    });
    return NextResponse.json({
      ok: true,
      reportId: report.id,
      shareToken: session.shareToken ?? session.id,
      riskBand: riskBand?.label,
      totals,
      focusMetrics,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "ساخت گزارش انجام نشد. دقایقی بعد دوباره تلاش کن." },
      { status: 500 },
    );
  }
}
