import Link from "next/link";

import { regenerateReportAction } from "@/app/(admin)/admin/(protected)/sessions/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { texts } from "@/lib/texts/fa";
import { formatDate, toPersianDigits } from "@/lib/i18n/format";

export const runtime = "nodejs";

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q ?? "";
  const sessions = await prisma.assessmentSession.findMany({
    where: query
      ? {
          OR: [
            { id: { contains: query } },
            { userEmail: { contains: query } },
            { riskBand: { contains: query } },
          ],
        }
      : undefined,
    include: {
      questionnaire: { select: { title: true } },
      report: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{texts.admin.sessions.title}</h1>
          <p className="text-sm text-slate-400">{texts.admin.sessions.subtitle}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/api/admin/sessions/export">{texts.admin.sessions.export}</Link>
        </Button>
      </div>
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>فیلترها</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-wrap items-center gap-3">
            <Input
              name="q"
              placeholder={texts.admin.sessions.searchPlaceholder}
              defaultValue={query}
              className="w-64"
            />
            <Button type="submit">{texts.admin.sessions.search}</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>{texts.admin.sessions.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{texts.admin.sessions.table.id}</TableHead>
                <TableHead>{texts.admin.sessions.table.status}</TableHead>
                <TableHead>{texts.admin.sessions.table.risk}</TableHead>
                <TableHead>{texts.admin.sessions.table.questionnaire}</TableHead>
                <TableHead>{texts.admin.sessions.table.completedAt}</TableHead>
                <TableHead>{texts.admin.sessions.table.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-mono text-xs">
                    {toPersianDigits(session.id.slice(0, 8))}
                  </TableCell>
                  <TableCell>{session.status === "COMPLETE" ? "تکمیل شده" : "در حال انجام"}</TableCell>
                  <TableCell>{session.riskBand ?? "—"}</TableCell>
                  <TableCell>{session.questionnaire.title}</TableCell>
                  <TableCell>
                    {session.completedAt ? formatDate(session.completedAt) : "در حال انجام"}
                  </TableCell>
                  <TableCell className="space-x-2 rtl:space-x-reverse">
                    {session.report ? (
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/report/${session.shareToken ?? session.id}`}>
                          {texts.admin.sessions.table.view}
                        </Link>
                      </Button>
                    ) : null}
                    <form action={regenerateReportAction} className="inline">
                      <input type="hidden" name="sessionId" value={session.id} />
                      <Button type="submit" size="sm" variant="ghost">
                        {texts.admin.sessions.table.regenerate}
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
