
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { PlayCircle, Eye } from "lucide-react";

export function Episodes() {
    return (
        <Section id="episodes" className="bg-gradient-to-br from-background via-primary/5 to-background text-center">
            <div className="mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">دو تجربه متفاوت</h2>
                <p className="text-muted-foreground text-lg">بسته به نیاز خود، نوع سناریو را انتخاب کنید.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                {/* Card 1: Evaluation */}
                <div className="group relative rounded-3xl overflow-hidden border border-white/10 bg-card p-1">
                    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="bg-background/50 h-full rounded-[1.3rem] p-8 md:p-12 space-y-6 flex flex-col items-center">
                        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Eye className="size-8" />
                        </div>
                        <h3 className="text-2xl font-bold">ارزیابی (Evaluation)</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            بدون راهنمایی و کمک هوش مصنوعی. در این حالت شما با چالش‌های واقعی روبرو می‌شوید تا سبک رهبری و نقاط ضعف واقعی شما شناسایی شود.
                        </p>
                        <ul className="text-sm font-medium space-y-2 text-start w-full opacity-80 mt-auto pt-8">
                            <li className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-primary" /> کشف سبک مدیریتی</li>
                            <li className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-primary" /> شبیه‌سازی فشار واقعی</li>
                        </ul>
                    </div>
                </div>

                {/* Card 2: Practice */}
                <div className="group relative rounded-3xl overflow-hidden border border-white/10 bg-card p-1">
                    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="bg-background/50 h-full rounded-[1.3rem] p-8 md:p-12 space-y-6 flex flex-col items-center">
                        <div className="size-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                            <PlayCircle className="size-8" />
                        </div>
                        <h3 className="text-2xl font-bold">تمرین (Practice)</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            تمرین هدایت‌شده با بازخورد لحظه‌ای. مربی هوش مصنوعی در هر مرحله به شما نکاتی می‌گوید تا مهارت‌های خاصی (مثل همدلی یا قاطعیت) را تقویت کنید.
                        </p>
                        <ul className="text-sm font-medium space-y-2 text-start w-full opacity-80 mt-auto pt-8">
                            <li className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-accent" /> یادگیری حین انجام کار</li>
                            <li className="flex items-center gap-2"><div className="size-1.5 rounded-full bg-accent" /> تمرکز روی ۱-۳ مهارت خاص</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-16">
                <Button variant="outline" size="lg" className="rounded-full px-8">
                    مشاهده نمونه سناریوها
                </Button>
            </div>
        </Section>
    );
}
