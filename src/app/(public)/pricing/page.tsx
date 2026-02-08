
import { Workspace } from "@/components/landing/Workspace";
import { FAQ } from "@/components/landing/FAQ";

export default function PricingPage() {
    return (
        <div className="pt-32 pb-20">
            <div className="text-center container mx-auto mb-16 px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">طرح‌های اشتراک</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    برای تیم‌ها و افرادی که می‌خواهند مهارت‌های خود را به سطح بعدی برسانند.
                </p>
            </div>
            <Workspace />
            <FAQ />
        </div>
    );
}
