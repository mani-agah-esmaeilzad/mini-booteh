
import { Section } from "@/components/ui/section";
import { Zap, AlertTriangle, check } from "lucide-react";

export function ProblemGap() {
    return (
        <Section className="bg-gradient-to-b from-background to-secondary/20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium w-fit">
                        <AlertTriangle className="size-4" />
                        چالش‌های امروز
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                        مدیران فنی عالی،
                        <span className="text-muted-foreground block">اغلب رهبران خوبی نیستند.</span>
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        ارتقا به نقش مدیریت بدون آموزش مهارت‌های نرم، باعث فرسودگی تیم‌ها و شکست پروژه‌ها می‌شود. روش‌های سنتی آموزش (کلاس‌های خشک) دیگر پاسخگو نیستند.
                    </p>

                    <ul className="space-y-4">
                        {[
                            "عدم بازخورد واقعی در محیط کار",
                            "ترس از تجربه کردن در شرایط حساس",
                            "نبود زمان کافی برای منتورشیپ"
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-3 text-lg font-medium">
                                <div className="size-6 rounded-full bg-destructive/20 text-destructive flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </div>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative">
                    {/* Chart or Graphic showing the 'Gap' */}
                    <div className="p-8 rounded-3xl bg-card border border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32 rounded-full" />

                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-end h-64 gap-4">
                                <div className="w-1/3 bg-white/5 rounded-t-xl h-[40%] relative group-hover:bg-white/10 transition-colors">
                                    <span className="absolute -top-8 w-full text-center text-sm font-bold text-muted-foreground">مهارت فنی</span>
                                </div>
                                <div className="w-1/3 bg-destructive/20 rounded-t-xl h-[20%] relative animate-pulse">
                                    <span className="absolute -top-8 w-full text-center text-sm font-bold text-destructive">مهارت نرم</span>
                                </div>
                                <div className="w-1/3 bg-primary rounded-t-xl h-[85%] relative shadow-[0_0_30px_rgba(var(--primary),0.5)]">
                                    <span className="absolute -top-8 w-full text-center text-sm font-bold text-primary">نیاز نقش</span>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/10 text-center">
                                <p className="text-xl font-bold">شکاف ۶۵٪</p>
                                <p className="text-sm text-muted-foreground">در آمادگی برای رهبری تیم</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
