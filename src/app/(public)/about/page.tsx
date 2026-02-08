
import { Section } from "@/components/ui/section";

export default function AboutPage() {
    return (
        <div className="pt-32 pb-20">
            <Section className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-8">درباره مینی‌بوته</h1>
                <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                    <p>
                        ما معتقدیم که مهارت‌های نرم، سخت‌ترین مهارت‌ها برای یادگیری هستند. در دنیایی که هوش مصنوعی کارهای فنی را خودکار می‌کند، آنچه انسان را متمایز می‌کند، توانایی رهبری، همدلی و ارتباط موثر است.
                    </p>
                    <p>
                        مینی‌بوته با ترکیب علوم شناختی و آخرین مدل‌های زبانی بزرگ (LLM)، یک مربی شخصی همیشه در دسترس برای شما فراهم می‌کند.
                    </p>

                    <h2 className="text-3xl font-bold pt-8">ماموریت ما</h2>
                    <p>
                        دموکراتیک کردن آموزش رهبری. ما می‌خواهیم هر مدیر محصول، توسعه‌دهنده و طراح، دسترسی به برترین کوچ‌های مدیریتی را داشته باشد.
                    </p>
                </div>
            </Section>
        </div>
    );
}
