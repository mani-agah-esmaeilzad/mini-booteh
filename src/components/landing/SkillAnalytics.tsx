"use client";

import { Section } from "@/components/ui/section";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

const data = [
    { subject: 'ارتباطات', A: 120, B: 110, fullMark: 150 },
    { subject: 'رهبری', A: 98, B: 130, fullMark: 150 },
    { subject: 'همدلی', A: 86, B: 130, fullMark: 150 },
    { subject: 'حل مسئله', A: 99, B: 100, fullMark: 150 },
    { subject: 'تاب‌آوری', A: 85, B: 90, fullMark: 150 },
    { subject: 'تصمیم‌گیری', A: 65, B: 85, fullMark: 150 },
];

export function SkillAnalytics() {
    return (
        <Section id="analytics" className="bg-background overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px] pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-16 items-center container mx-auto relative z-10">
                <div className="space-y-8 text-right">
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                        تجسم دقیق
                        <span className="text-primary block mt-2">رشد مهارت‌ها</span>
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        با داشبورد تحلیلی ما، نقاط کور مهارتی خود را ببینید. نمودارهای راداری پیشرفت شما را در ۶ دسته کلیدی و ۴۴ زیر-مهارت نشان می‌دهند.
                    </p>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="p-4 rounded-xl bg-secondary/30 border border-secondary">
                            <div className="text-3xl font-bold text-foreground mb-1">۴۴</div>
                            <div className="text-xs text-muted-foreground">زیر-مهارت قابل سنجش</div>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/30 border border-secondary">
                            <div className="text-3xl font-bold text-foreground mb-1">۶</div>
                            <div className="text-xs text-muted-foreground">دسته اصلی رهبری</div>
                        </div>
                    </div>
                </div>

                <div className="h-[400px] w-full bg-card/30 backdrop-blur-sm border border-white/10 rounded-3xl p-4 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                            <PolarGrid stroke="rgba(255,255,255,0.1)" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                            <Radar
                                name="Mike"
                                dataKey="A"
                                stroke="var(--primary)"
                                strokeWidth={3}
                                fill="var(--primary)"
                                fillOpacity={0.3}
                            />
                            <Radar
                                name="Lily"
                                dataKey="B"
                                stroke="var(--accent)"
                                strokeWidth={2}
                                fill="transparent"
                                fillOpacity={0}
                                strokeDasharray="4 4"
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Section>
    );
}
