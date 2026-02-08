
import { Section } from "@/components/ui/section";

const metrics = [
    { label: "مهارت‌های رهبری", value: "۴۵+" },
    { label: "سناریوی تعاملی", value: "۱۲۰+" },
    { label: "مدیر فعال", value: "۲۰۰۰+" },
    { label: "نرخ رضایت", value: "۹۸٪" },
];

export function Metrics() {
    return (
        <Section className="py-12 border-y bg-background/50 backdrop-blur-sm">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center divide-x divide-x-reverse divide-border/50">
                {metrics.map((metric, index) => (
                    <div key={index} className="flex flex-col gap-2 p-4">
                        <span className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent tracking-tighter">
                            {metric.value}
                        </span>
                        <span className="text-sm md:text-base text-muted-foreground font-medium">
                            {metric.label}
                        </span>
                    </div>
                ))}
            </div>
        </Section>
    );
}
