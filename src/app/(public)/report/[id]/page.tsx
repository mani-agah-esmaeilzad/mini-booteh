
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShieldAlert, Download, ArrowLeft, Brain, Activity, CheckCircle2 } from "lucide-react";

// For charts (Client Component wrapper needed if using Recharts directly here, 
// but we can make this a Server Component and import a Client Chart component)
import { ReportCharts } from "./components/ReportCharts";

export const metadata: Metadata = {
    title: "گزارش تحلیل تمرکز",
    description: "نتایج غربالگری خودگزارش‌دهی",
};

export const dynamic = 'force-dynamic';

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const session = await prisma.assessmentSession.findUnique({
        where: { id },
        include: {
            report: true,
            focusRuns: true,
        }
    });

    if (!session || !session.report) {
        return notFound();
    }

    const { riskBand, totalsJson } = session;
    const metrics = session.totalsJson as any[]; // Array of ScoreResult
    const narrative = session.report.narrativeMd;
    const focusRun = session.focusRuns[0]; // Take the first run if exists

    // Map risk to color/text
    const riskMap = {
        LOW: { color: "bg-green-500", text: "ریسک پایین", desc: "علائم گزارش‌شده در محدوده نرمال قرار دارند." },
        MODERATE: { color: "bg-yellow-500", text: "ریسک متوسط", desc: "برخی علائم قابل توجه هستند." },
        HIGH: { color: "bg-red-500", text: "ریسک بالا", desc: "الگوی علائم شباهت زیادی به ADHD دارد." },
    };

    // Normalized risk key
    const riskKey = riskBand === "HIGH" ? "HIGH" : riskBand === "MODERATE" ? "MODERATE" : "LOW";
    const riskInfo = riskMap[riskKey];

    return (
        <div className="min-h-screen bg-background pt-24 pb-20 px-4">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">گزارش تحلیل تمرکز</h1>
                        <p className="text-muted-foreground">تاریخ: {new Date(session.completedAt || Date.now()).toLocaleDateString('fa-IR')}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            دانلود PDF
                        </Button>
                        <Link href="/start">
                            <Button size="sm">
                                تست مجدد
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Disclaimer - Critical */}
                <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>سلب مسئولیت مهم</AlertTitle>
                    <AlertDescription>
                        این گزارش صرفاً نتیجه یک غربالگری اولیه است و **تشخیص پزشکی محسوب نمی‌شود**.
                        برای تفسیر دقیق و دریافت برنامه درمانی، حتماً با روان‌شناس یا روان‌پزشک مشورت کنید.
                    </AlertDescription>
                </Alert>

                {/* Overview Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-l-4" style={{ borderLeftColor: riskKey === 'HIGH' ? '#ef4444' : riskKey === 'MODERATE' ? '#eab308' : '#22c55e' }}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                وضعیت کلی
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <Badge className={`${riskInfo.color} text-white hover:${riskInfo.color} text-lg px-4 py-1`}>
                                    {riskInfo.text}
                                </Badge>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {riskInfo.desc}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Brain className="h-5 w-5" />
                                عملکرد در تست تمرکز
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {focusRun ? (
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold">{Math.round((focusRun.accuracy || 0) * 100)}%</div>
                                        <div className="text-xs text-muted-foreground">دقت</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{Math.round(focusRun.reactionAvgMs || 0)}ms</div>
                                        <div className="text-xs text-muted-foreground">سرعت واکنش</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground py-2">
                                    تست تمرکز انجام نشده است.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Narrative Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>تحلیل تفصیلی</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line">
                            {narrative}
                        </div>
                    </CardContent>
                </Card>

                {/* Charts Section */}
                <ReportCharts metrics={metrics} />

                {/* Next Steps */}
                <Card className="bg-secondary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            قدم‌های بعدی پیشنهادی
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            <li>این گزارش را ذخیره کنید تا در مراجعه به متخصص همراه داشته باشید.</li>
                            <li>اگر در بخش «بی‌توجهی» نمره بالا دارید، تکنیک‌های مدیریت زمان (مثل پومودورو) را امتحان کنید.</li>
                            <li>اگر نمره «بیش‌فعالی» بالاست، فعالیت‌های ورزشی روزانه می‌تواند کمک‌کننده باشد.</li>
                            <li>برای تشخیص قطعی به کلینیک‌های روانشناسی مراجعه کنید.</li>
                        </ul>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
