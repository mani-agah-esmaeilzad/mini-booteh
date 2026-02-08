
import { Section } from "@/components/ui/section";
import { UserCheck, FileText, MessageSquare } from "lucide-react";

export function Hiring() {
    return (
        <Section id="hiring" className="bg-gradient-to-t from-background to-secondary/10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium w-fit mb-6">
                        ویژه مدیران منابع انسانی
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">بهترین استعدادها را با داده استخدام کنید</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                        نه فقط بر اساس رزومه، بلکه بر اساس مهارت‌های واقعی. پلتفرم ما به شما کمک می‌کند تا تناسب دقیق نامزد با نیازهای نقش را بسنجید.
                    </p>

                    <ul className="space-y-6">
                        <li className="flex gap-4">
                            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                <FileText className="size-5" />
                            </div>
                            <div>
                                <h4 className="font-bold">تولید پروفایل نقش</h4>
                                <p className="text-sm text-muted-foreground mt-1">ساخت خودکار نیازمندی‌های مهارتی از شرح شغل.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="size-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                                <UserCheck className="size-5" />
                            </div>
                            <div>
                                <h4 className="font-bold">امتیاز تطابق (Match Score)</h4>
                                <p className="text-sm text-muted-foreground mt-1">مقایسه دقیق مهارت‌های نامزد با نیازهای سازمان.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="size-10 rounded-lg bg-foreground/10 flex items-center justify-center text-foreground flex-shrink-0">
                                <MessageSquare className="size-5" />
                            </div>
                            <div>
                                <h4 className="font-bold">پیشنهاد سوال مصاحبه</h4>
                                <p className="text-sm text-muted-foreground mt-1">تولید سوالات عمیق برای بررسی نقاط مبهم رزومه.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="relative">
                    {/* Visual graphic for Matching */}
                    <div className="aspect-[4/3] rounded-3xl bg-card border border-white/5 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
                        <div className="relative z-10 bg-background border border-white/10 rounded-2xl p-6 w-3/4 shadow-2xl">
                            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-secondary" />
                                    <div>
                                        <div className="w-24 h-4 bg-secondary rounded animate-pulse" />
                                        <div className="w-16 h-3 bg-secondary/50 rounded mt-2" />
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-green-500">۹۴٪</div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>رهبری</span>
                                    <span>۹/۱۰</span>
                                </div>
                                <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-500 w-[90%] h-full" />
                                </div>

                                <div className="flex justify-between text-sm mt-4">
                                    <span>ارتباطات</span>
                                    <span>۸.۵/۱۰</span>
                                </div>
                                <div className="w-full bg-secondary/30 h-2 rounded-full overflow-hidden">
                                    <div className="bg-green-500 w-[85%] h-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
