
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-background py-16">
            <div className="container mx-auto px-4 grid md:grid-cols-4 gap-12">
                <div className="col-span-1 space-y-4">
                    <Logo className="text-2xl" />
                    <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                        پلتفرم هوشمند توسعه مهارت‌های نرم و رهبری برای آینده کار.
                    </p>
                    <div className="flex gap-4">
                        {/* Social Icons Placeholder */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className="size-8 rounded bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
                        ))}
                    </div>
                </div>

                {[
                    { title: "محصول", links: ["ویژگی‌ها", "مسیرها", "سازمانی", "قیمت‌گذاری"] },
                    { title: "منابع", links: ["وبلاگ", "راهنما", "کیس استادی", "کتاب الکترونیک"] },
                    { title: "شرکت", links: ["درباره ما", "فرصت‌های شغلی", "تماس", "قوانین"] },
                ].map((col, idx) => (
                    <div key={idx} className="col-span-1 space-y-4">
                        <h4 className="font-bold">{col.title}</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            {col.links.map(link => (
                                <li key={link}>
                                    <Link href="#" className="hover:text-primary transition-colors">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/5 text-center text-sm text-muted-foreground">
                ©۱۴۰۳ مینی‌بوته. تمامی حقوق محفوظ است. توسعه با ❤️ و هوش مصنوعی.
            </div>
        </footer>
    );
}
