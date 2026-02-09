
import { Section } from "@/components/ui/section";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        q: "آیا این تست به من می‌گوید که ADHD دارم؟",
        a: "خیر. این ابزار فقط یک «غربالگری» است و احتمال وجود علائم را نشان می‌دهد. تشخیص قطعی فقط توسط متخصص (روان‌پزشک یا روان‌شناس) و با مصاحبه بالینی انجام می‌شود."
    },
    {
        q: "چقدر طول می‌کشد؟",
        a: "معمولاً بین ۵ تا ۱۰ دقیقه. شامل پاسخ به ۱۸ سوال و یک تست تمرکز ۲ دقیقه‌ای (اختیاری)."
    },
    {
        q: "آیا اطلاعات من ذخیره می‌شود؟",
        a: "پاسخ‌ها به صورت ناشناس و فقط برای تولید گزارش شما پردازش می‌شوند. ایمیل هم اختیاری است."
    },
    {
        q: "تست تمرکز (Focus Test) چیست؟",
        a: "یک آزمون ساده که سرعت واکنش و دقت شما را در مهار پاسخ‌های تکانشی می‌سنجد. این آزمون مکمل پرسشنامه است."
    },
    {
        q: "آیا برای کودکان هم مناسب است؟",
        a: "این نسخه فعلی برای بزرگسالان (۱۸+) طراحی شده است. نسخه کودکان باید توسط والدین تکمیل شود (به‌زودی)."
    }
];

export function FAQ() {
    return (
        <Section className="py-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">سوالات متداول</h2>
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`}>
                        <AccordionTrigger className="text-start">{faq.q}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </Section>
    );
}
