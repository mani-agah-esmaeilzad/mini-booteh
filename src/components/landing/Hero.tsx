import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import Link from "next/link";
import { ArrowLeft, BrainCircuit } from "lucide-react";

export function Hero() {
    return (
        <Section className="pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium w-fit animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        نسخه آزمایشی موتور غربالگری
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.15] text-foreground">
                        شناخت الگوی
                        <span className="text-primary block mt-2">تمرکز و توجه</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                        با ترکیبی از پرسشنامه استاندارد و آزمون واکنش‌سنجی، در کمتر از ۱۰ دقیقه وضعیت توجه خود را بررسی کنید.
                        <br />
                        <span className="text-sm opacity-80">(محرمانه، ناشناس و رایگان)</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <Button variant="shine" size="xl" asChild>
                            <Link href="/start">
                                شروع غربالگری
                                <ArrowLeft className="mr-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button variant="outline" size="xl" asChild>
                            <Link href="/start">
                                <BrainCircuit className="ml-2 h-5 w-5" />
                                آشنایی با روش کار
                            </Link>
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 mt-8 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                            بدون نیاز به ثبت‌نام
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                            گزارش فوری
                        </p>
                    </div>
                </div>

                <div className="relative lg:h-[600px] w-full flex items-center justify-center">
                    {/* Abstract Visual Construction */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent blur-[100px] rounded-full opacity-50 animate-pulse-slow" />

                    <div className="relative w-full aspect-square max-w-md lg:max-w-full bg-card/30 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden p-6 hover:scale-[1.02] transition-transform duration-700">
                        {/* Simple UI Mockup inside Hero */}
                        <div className="absolute top-0 inset-x-0 h-14 border-b border-white/5 flex items-center px-6 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>

                        <div className="mt-12 space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                                    <BrainCircuit className="w-6 h-6 text-primary" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                                    <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse delay-100" />
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm leading-relaxed text-muted-foreground">
                                تحلیل سیستم: نمرات شما در بخش «تکانشگری» کمی بالاتر از میانگین است. این می‌تواند به معنای تصمیم‌گیری‌های سریع و خلاقانه باشد، اما گاهی باعث عجله می‌شود...
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-24 rounded-xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center gap-2">
                                    <span className="text-2xl font-bold text-primary">۳۲۵ms</span>
                                    <span className="text-xs text-muted-foreground">سرعت واکنش</span>
                                </div>
                                <div className="h-24 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2">
                                    <span className="text-2xl font-bold text-foreground">۹۵٪</span>
                                    <span className="text-xs text-muted-foreground">دقت تمرکز</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
