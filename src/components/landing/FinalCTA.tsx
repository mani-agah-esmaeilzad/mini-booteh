
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FinalCTA() {
    return (
        <Section className="py-32 text-center">
            <div className="relative rounded-[3rem] overflow-hidden bg-primary px-8 py-20 md:py-32">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />

                <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                    <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground tracking-tight">
                        هوشمندتر تمرین کن،
                        <br />
                        سریع‌تر رشد کن.
                    </h2>
                    <p className="text-xl text-primary-foreground/80 max-w-xl mx-auto">
                        به جمع ۲۰۰۰+ مدیر محصول و رهبر فنی بپیوندید که مهارت‌های خود را متحول کرده‌اند.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button size="xl" variant="secondary" className="font-bold text-primary" asChild>
                            <Link href="/start">شروع رایگان</Link>
                        </Button>
                        <Button size="xl" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-white/10" asChild>
                            <Link href="/start">درخواست دمو</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Section>
    );
}
