
import { Section } from "@/components/ui/section";
import { BrainCircuit, PenTool, BarChart3, Users } from "lucide-react";

export function FeaturesSplit() {
    return (
        <Section id="companion" className="bg-background">
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Card 1: Analyst */}
                <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-card to-card/50 p-8 md:p-12 hover:border-primary/50 transition-colors duration-500">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
                    <div className="relative z-10 space-y-6 text-right">
                        <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                            <BrainCircuit className="size-6" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold">همراه تحلیلگر</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            تحلیل دقیق مهارت‌های شما با استفاده از الگوریتم‌های پیشرفته. شناسایی نقاط قوت و ضعف و ارائه گزارش‌های جامع برای رشد شخصی.
                        </p>
                        <ul className="space-y-3 pt-4">
                            {[
                                "تحلیل شکاف مهارتی (Gap Analysis)",
                                "مسیر یادگیری شخصی‌سازی شده",
                                "گزارش پیشرفت هفتگی"
                            ].map(item => (
                                <li key={item} className="flex items-center gap-2 text-sm md:text-base font-medium">
                                    <div className="size-1.5 rounded-full bg-primary" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        {/* Visual Placeholder */}
                        <div className="mt-8 h-48 w-full rounded-xl bg-black/20 border border-white/5 relative overflow-hidden group-hover:bg-black/30 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50" />
                            {/* Mock Chart */}
                            <div className="flex items-end justify-center gap-2 h-full pb-4 px-8">
                                <div className="w-4 bg-primary/40 h-[40%] rounded-t-sm" />
                                <div className="w-4 bg-primary/60 h-[60%] rounded-t-sm" />
                                <div className="w-4 bg-primary h-[80%] rounded-t-sm group-hover:h-[90%] transition-all duration-500 delay-100" />
                                <div className="w-4 bg-primary/60 h-[50%] rounded-t-sm" />
                                <div className="w-4 bg-primary/40 h-[30%] rounded-t-sm" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Experience */}
                <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-bl from-secondary/30 to-background p-8 md:p-12 hover:border-accent/50 transition-colors duration-500">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
                    <div className="relative z-10 space-y-6 text-right">
                        <div className="inline-flex size-12 items-center justify-center rounded-xl bg-accent/20 text-accent">
                            <Users className="size-6" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold">همراه تجربه‌ساز</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            قرارگیری در سناریوهای واقعی مدیریت و رهبری. تجربه تصمیم‌گیری در شرایط بحرانی بدون ریسک واقعی و دریافت بازخورد آنی.
                        </p>
                        <ul className="space-y-3 pt-4">
                            {[
                                "شبیه‌سازی جلسات ۱ به ۱",
                                "مدیریت تعارض تیمی",
                                "مذاکره و اقناع"
                            ].map(item => (
                                <li key={item} className="flex items-center gap-2 text-sm md:text-base font-medium">
                                    <div className="size-1.5 rounded-full bg-accent" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        {/* Visual Placeholder */}
                        <div className="mt-8 h-48 w-full rounded-xl bg-black/20 border border-white/5 relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50" />
                            {/* Chat Bubbles */}
                            <div className="space-y-3 w-3/4 opacity-80 group-hover:opacity-100 transition-opacity">
                                <div className="h-2 w-1/2 bg-white/20 rounded-full ml-auto" />
                                <div className="h-2 w-2/3 bg-accent/30 rounded-full mr-auto" />
                                <div className="h-2 w-1/3 bg-accent/30 rounded-full mr-auto delay-100" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
