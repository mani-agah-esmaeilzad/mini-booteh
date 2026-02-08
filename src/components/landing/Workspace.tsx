
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function Workspace() {
    return (
        <Section id="workspace" className="bg-background">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">برای هر نیاز، یک فضای اختصاصی</h2>
                <p className="text-muted-foreground">چه برای رشد شخصی، چه برای تیم‌های چابک و سازمان‌های بزرگ.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Individual */}
                <div className="rounded-3xl border border-border bg-card/50 p-8 space-y-8 flex flex-col hover:border-primary/50 transition-colors">
                    <div>
                        <h3 className="text-xl font-bold">شخصی</h3>
                        <p className="text-sm text-muted-foreground mt-2">برای مدیران و رهبران آینده</p>
                        <div className="mt-4 text-3xl font-bold">رایگان <span className="text-sm font-normal text-muted-foreground">/ شروع</span></div>
                    </div>
                    <ul className="space-y-3 flex-1">
                        {["دسترسی به ۳ سناریوی پایه", "گزارش تحلیل سبک اولیه", "پروفایل رشد شخصی"].map(item => (
                            <li key={item} className="flex items-center gap-2 text-sm">
                                <Check className="size-4 text-primary" /> {item}
                            </li>
                        ))}
                    </ul>
                    <Button className="w-full rounded-full" variant="outline">شروع کنید</Button>
                </div>

                {/* Team */}
                <div className="rounded-3xl border-2 border-primary bg-card p-8 space-y-8 flex flex-col shadow-2xl shadow-primary/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl">پیشنهاد ما</div>
                    <div>
                        <h3 className="text-xl font-bold text-primary">تیمی</h3>
                        <p className="text-sm text-muted-foreground mt-2">برای استارتاپ‌ها و تیم‌های محصول</p>
                        <div className="mt-4 text-3xl font-bold">۱.۵ م <span className="text-sm font-normal text-muted-foreground">/ کاربر / ماه</span></div>
                    </div>
                    <ul className="space-y-3 flex-1">
                        {["دسترسی نامحدود به سناریوها", "داشبورد تحلیلی پیشرفته", "مقایسه عملکرد اعضای تیم", "خروجی PDF گزارش‌ها"].map(item => (
                            <li key={item} className="flex items-center gap-2 text-sm font-medium">
                                <Check className="size-4 text-primary" /> {item}
                            </li>
                        ))}
                    </ul>
                    <Button className="w-full rounded-full" variant="shine">امتحان رایگان ۱۴ روزه</Button>
                </div>

                {/* Enterprise */}
                <div className="rounded-3xl border border-border bg-card/50 p-8 space-y-8 flex flex-col hover:border-foreground/50 transition-colors">
                    <div>
                        <h3 className="text-xl font-bold">سازمانی</h3>
                        <p className="text-sm text-muted-foreground mt-2">برای شرکت‌های بزرگ</p>
                        <div className="mt-4 text-3xl font-bold">تماس <span className="text-sm font-normal text-muted-foreground">/ سفارشی</span></div>
                    </div>
                    <ul className="space-y-3 flex-1">
                        {["یکپارچگی با LMS و HRIS", "سناریوهای اختصاصی صنعت", "مدیر حساب اختصاصی", "SLA و پشتیبانی ۲۴/۷"].map(item => (
                            <li key={item} className="flex items-center gap-2 text-sm">
                                <Check className="size-4 text-muted-foreground" /> {item}
                            </li>
                        ))}
                    </ul>
                    <Button className="w-full rounded-full" variant="ghost">تماس با فروش</Button>
                </div>
            </div>
        </Section>
    );
}
