
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
    currentStep: number;
    steps: { id: number; label: string }[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-12 relative px-4">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-secondary -z-10 translate-y-[-50%]" />

            {/* Progress Line */}
            <div
                className="absolute top-1/2 right-0 h-0.5 bg-primary -z-10 translate-y-[-50%] transition-all duration-500 ease-out"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;

                return (
                    <div key={step.id} className="flex flex-col items-center gap-2 group">
                        <div
                            className={cn(
                                "w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 bg-background",
                                isCompleted ? "bg-primary border-primary text-primary-foreground" :
                                    isCurrent ? "border-primary text-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] scale-110" :
                                        "border-secondary text-muted-foreground bg-background"
                            )}
                        >
                            {isCompleted ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : <span className="text-sm md:text-base font-bold">{step.id}</span>}
                        </div>
                        <span className={cn(
                            "text-xs font-medium absolute -bottom-8 whitespace-nowrap transition-colors duration-300",
                            isCurrent ? "text-foreground" : "text-muted-foreground"
                        )}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
