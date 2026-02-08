
import { Section } from "@/components/ui/section";

const steps = [
    { id: "01", title: "انتخاب مسیر", desc: "انتخاب مهارت کلیدی (رهبری، ارتباطات، ...)" },
    { id: "02", title: "تعیین هدف", desc: "مشخص کردن سطح مطلوب و زمان‌بندی" },
    { id: "03", title: "انتخاب عمق", desc: "سطح مقدماتی تا پیشرفته و چالش‌برانگیز" },
    { id: "04", title: "پروفایل رشد", desc: "ساخت شخصیت مدیریتی و سبک شخصی" },
    { id: "05", title: "اجرای همزمان", desc: "تمرین چندین مهارت در سناریوهای ترکیبی" },
];

export function Roadmap() {
    return (
        <Section id="roadmap" className="bg-gradient-to-br from-background via-secondary/10 to-background border-y border-white/5">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">مسیر رشد هوشمند</h2>
                <p className="text-muted-foreground">فرایند ۵ مرحله‌ای ما برای تبدیل دانش تئوری به مهارت عملی و ماندگار.</p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent -z-10" />

                {steps.map((step, index) => (
                    <div key={step.id} className="relative group pt-4 md:pt-0">
                        {/* Step Number Bubble */}
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-background border-2 border-primary/20 group-hover:border-primary group-hover:scale-110 transition-all flex items-center justify-center text-xl font-bold text-muted-foreground group-hover:text-primary z-10 mx-auto mb-6 shadow-lg shadow-black/50">
                            {step.id}
                        </div>

                        {/* Content */}
                        <div className="text-center px-2 space-y-2">
                            <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{step.title}</h4>
                            <p className="text-sm text-muted-foreground">{step.desc}</p>
                        </div>

                        {/* Connector Line (Mobile) */}
                        {index !== steps.length - 1 && (
                            <div className="md:hidden absolute left-1/2 top-16 bottom-0 w-0.5 bg-border -ml-px h-12" />
                        )}
                    </div>
                ))}
            </div>
        </Section>
    );
}
