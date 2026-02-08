
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { BookOpen, Video, FileText } from "lucide-react";

export default function ResourcesPage() {
    const resources = [
        { title: "چگونه بازخورد سازنده بدهیم؟", category: "رهبری", icon: FileText },
        { title: "وبینار مدیریت تعارض در تیم‌های چابک", category: "وبینار", icon: Video },
        { title: "راهنمای جامع جلسات ۱ به ۱", category: "کتاب الکترونیک", icon: BookOpen },
        { title: "هوش هیجانی در دورکاری", category: "ارتباطات", icon: FileText },
        { title: "نقشه راه رشد مدیر محصول", category: "شغل", icon: BookOpen },
        { title: "مصاحبه با مدیران ارشد سیلیکون ولی", category: "مصاحبه", icon: Video },
    ];

    return (
        <div className="pt-32 pb-20">
            <div className="text-center container mx-auto mb-16 px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">منابع یادگیری</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    مقالات، ویدیوها و راهنماهای کاربردی برای توسعه مهارت‌ها.
                </p>
            </div>

            <Section className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {resources.map((res, i) => {
                        const Icon = res.icon;
                        return (
                            <Card key={i} className="p-6 hover:border-primary/50 transition-colors group cursor-pointer bg-card/50">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-2 rounded-lg bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Icon className="size-6" />
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary border border-border">
                                        {res.category}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                    {res.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    مطالعه در ۵ دقیقه • سطح متوسط
                                </p>
                            </Card>
                        );
                    })}
                </div>
            </Section>
        </div>
    );
}
