
import { Section } from "@/components/ui/section";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        q: "آیا این پلتفرم برای افراد بدون سابقه مدیریت مناسب است؟",
        a: "بله، مسیرهای یادگیری ما از سطح مقدماتی شروع می‌شوند و برای افرادی که قصد دارند برای اولین بار نقش رهبری بگیرند ایده‌آل است."
    },
    {
        q: "چقدر زمان در هفته نیاز است؟",
        a: "طراحی میکرولرنینگ ما به شما اجازه می‌دهد با صرف روزانه ۱۵ دقیقه، پیشرفت چشمگیری داشته باشید."
    },
    {
        q: "آیا مدرک معتبر ارائه می‌شود؟",
        a: "پس از تکمیل هر مسیر و قبولی در چالش نهایی، گواهی دیجیتال قابل اشتراک در لینکدین دریافت می‌کنید."
    },
    {
        q: "تفاوت نسخه تیمی با شخصی چیست؟",
        a: "در نسخه تیمی، مدیران ارشد به داشبورد عملکرد تیم دسترسی دارند و می‌توانند چالش‌های گروهی تعریف کنند."
    },
    {
        q: "آیا امکان لغو اشتراک وجود دارد؟",
        a: "بله، شما می‌توانید هر زمان که بخواهید اشتراک خود را لغو کنید و تا پایان دوره پرداخت دسترسی داشته باشید."
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
