
import { Section } from "@/components/ui/section";

export function CaseStudy() {
    return (
        <Section className="bg-secondary/20 py-16">
            <div className="text-center mb-12">
                <h2 className="text-2xl font-bold">نتایج اثبات شده</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-white/5">
                <div className="p-6 space-y-2">
                    <div className="text-4xl font-bold text-primary">۲.۵x</div>
                    <p className="text-muted-foreground font-medium">سرعت یادگیری بیشتر</p>
                    <p className="text-xs text-muted-foreground opacity-70">نسبت به روش‌های سنتی کلاسی</p>
                </div>
                <div className="p-6 space-y-2">
                    <div className="text-4xl font-bold text-accent">۴۰٪</div>
                    <p className="text-muted-foreground font-medium">کاهش تعارض تیمی</p>
                    <p className="text-xs text-muted-foreground opacity-70">پس از ۳ ماه استفاده مداوم</p>
                </div>
                <div className="p-6 space-y-2">
                    <div className="text-4xl font-bold text-foreground">۹۲٪</div>
                    <p className="text-muted-foreground font-medium">نرخ تکمیل دوره‌ها</p>
                    <p className="text-xs text-muted-foreground opacity-70">در مقایسه با میانگین صنعت (۱۵٪)</p>
                </div>
            </div>
        </Section>
    );
}
