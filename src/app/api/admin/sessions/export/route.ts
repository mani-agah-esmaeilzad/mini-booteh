import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/i18n/format";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sessions = await prisma.assessmentSession.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      questionnaire: { select: { title: true } },
    },
  });
  const header = ["شناسه نشست", "عنوان ارزیابی", "وضعیت", "بازه ریسک", "زمان ایجاد", "زمان تکمیل"];
  const rows = [
    header.join(","),
    ...sessions.map((record) =>
      [
        record.id,
        record.questionnaire.title,
        record.status === "COMPLETE" ? "تکمیل شده" : "در حال انجام",
        record.riskBand ?? "",
        formatDate(record.createdAt),
        record.completedAt ? formatDate(record.completedAt) : "",
      ].join(","),
    ),
  ].join("\n");
  return new NextResponse(rows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="sessions.csv"',
    },
  });
}
