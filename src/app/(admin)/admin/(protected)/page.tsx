import { Activity, BarChart2, FileText, Users } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { texts } from "@/lib/texts/fa";
import { formatDate, toPersianDigits } from "@/lib/i18n/format";

export const runtime = "nodejs";

export default async function AdminDashboard() {
  const [sessionStats, recentSessions] = await Promise.all([
    prisma.assessmentSession.findMany({
      select: { id: true, status: true, totalsJson: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.assessmentSession.findMany({
      include: {
        questionnaire: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const completed = sessionStats.filter((session) => session.status === "COMPLETE");
  const completionRate = sessionStats.length
    ? (completed.length / sessionStats.length) * 100
    : 0;
  const getOverallScore = (value: unknown) => {
    if (value && typeof value === "object" && "overallScore" in (value as Record<string, unknown>)) {
      const score = (value as Record<string, unknown>).overallScore;
      return typeof score === "number" ? score : 0;
    }
    return 0;
  };
  const avgScore =
    completed.reduce((acc, session) => acc + getOverallScore(session.totalsJson), 0) /
    Math.max(1, completed.length);
  const statusMap: Record<string, string> = {
    COMPLETE: "تکمیل شده",
    IN_PROGRESS: "در حال انجام",
  };
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">{texts.admin.dashboard.welcome}</h1>
        <p className="text-sm text-slate-400">{texts.admin.dashboard.subtitle}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={texts.admin.dashboard.stats.totalSessions}
          value={toPersianDigits(sessionStats.length)}
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title={texts.admin.dashboard.stats.completionRate}
          value={`${toPersianDigits(completionRate.toFixed(1))}٪`}
          icon={<Activity className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title={texts.admin.dashboard.stats.avgScore}
          value={`${toPersianDigits(avgScore.toFixed(1))}٪`}
          icon={<BarChart2 className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title={texts.admin.dashboard.stats.reports}
          value={toPersianDigits(completed.length)}
          icon={<FileText className="h-5 w-5 text-primary" />}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{texts.admin.dashboard.table.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{texts.admin.dashboard.table.session}</TableHead>
                <TableHead>{texts.admin.dashboard.table.status}</TableHead>
                <TableHead>{texts.admin.dashboard.table.questionnaire}</TableHead>
                <TableHead>{texts.admin.dashboard.table.date}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-mono text-xs">
                    {toPersianDigits(session.id.slice(0, 8))}
                  </TableCell>
                  <TableCell>{statusMap[session.status] ?? session.status}</TableCell>
                  <TableCell>{session.questionnaire.title}</TableCell>
                  <TableCell>{formatDate(session.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
}) {
  return (
    <Card className="border border-slate-200 bg-white text-slate-900 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
