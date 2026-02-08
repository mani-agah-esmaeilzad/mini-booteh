
import { Section } from "@/components/ui/section";

const brands = [
    "TechFlow", "ProductPro", "GrowthMind", "TeamSync", "LeadUp", "InnovateX"
];

export function SocialProof() {
    return (
        <Section className="py-20 text-center">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-12">
                مورد اعتماد تیم‌های پیشرو
            </p>

            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {brands.map((brand) => (
                    <div key={brand} className="text-xl md:text-2xl font-bold text-foreground/40 hover:text-foreground hover:scale-110 transition-transform duration-300">
                        {brand}
                    </div>
                ))}
            </div>
        </Section>
    );
}
