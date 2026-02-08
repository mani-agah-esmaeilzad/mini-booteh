"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StartAssessmentForm } from "@/components/forms/start-assessment-form";
import { StepIndicator } from "./StepIndicator";
import { ArrowLeft, ArrowRight, BrainCircuit, Users, Target, Clock, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface StartWizardProps {
    allowEmail: boolean;
}

const steps = [
    { id: 1, label: "انتخاب هدف" },
    { id: 2, label: "نوع تجربه" },
    { id: 3, label: "عمق و زمان" },
    { id: 4, label: "شروع مسیر" },
];

export function StartWizard({ allowEmail }: StartWizardProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selections, setSelections] = useState({
        goal: "",
        mode: "",
        duration: ""
    });

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(c => c + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(c => c - 1);
    };

    const select = (key: keyof typeof selections, value: string) => {
        setSelections(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-12">
            <StepIndicator currentStep={currentStep} steps={steps} />

            <div className="min-h-[400px]">
                {/* Step 1: Goal */}
                {currentStep === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold">چه مهارتی را می‌خواهید تقویت کنید؟</h2>
                            <p className="text-muted-foreground">هدف اصلی خود را برای این جلسه انتخاب کنید.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { id: "leadership", title: "رهبری تیم", icon: Users, desc: "مدیریت افراد، انگیزش و تقسیم کار" },
                                { id: "communication", title: "ارتباط موثر", icon: BrainCircuit, desc: "فن بیان، مذاکره و شنیدن فعال" },
                                { id: "strategy", title: "تفکر استراتژیک", icon: Target, desc: "برنامه‌ریزی، تحلیل و تصمیم‌گیری کلان" },
                            ].map((item) => (
                                <Card
                                    key={item.id}
                                    onClick={() => select("goal", item.id)}
                                    className={cn(
                                        "p-6 cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg group relative overflow-hidden",
                                        selections.goal === item.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card/50"
                                    )}
                                >
                                    <div className={cn(
                                        "size-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
                                        selections.goal === item.id ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground group-hover:bg-primary/20 group-hover:text-primary"
                                    )}>
                                        <item.icon className="size-6" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Mode */}
                {currentStep === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold">نوع تجربه را مشخص کنید</h2>
                            <p className="text-muted-foreground">آیا می‌خواهید ارزیابی شوید یا تمرین کنید؟</p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                            {[
                                { id: "evaluation", title: "ارزیابی (Evaluation)", icon: ShieldCheck, desc: "شبیه‌سازی شرایط واقعی بدون راهنمایی. مناسب برای و دریافت گزارش نمره." },
                                { id: "practice", title: "تمرین (Practice)", icon: Zap, desc: "همراه با راهنمایی و بازخورد لحظه‌ای هوش مصنوعی. مناسب برای یادگیری." },
                            ].map((item) => (
                                <Card
                                    key={item.id}
                                    onClick={() => select("mode", item.id)}
                                    className={cn(
                                        "p-8 cursor-pointer transition-all hover:border-accent/50 hover:shadow-lg flex flex-col items-center text-center gap-4",
                                        selections.mode === item.id ? "border-accent bg-accent/5 ring-1 ring-accent" : "bg-card/50"
                                    )}
                                >
                                    <div className={cn(
                                        "size-16 rounded-2xl flex items-center justify-center transition-colors",
                                        selections.mode === item.id ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground"
                                    )}>
                                        <item.icon className="size-8" />
                                    </div>
                                    <h3 className="font-bold text-xl">{item.title}</h3>
                                    <p className="text-muted-foreground">{item.desc}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Depth/Duration */}
                {currentStep === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold">عمق و زمان جلسه</h2>
                            <p className="text-muted-foreground">چقدر می‌خواهید وقت بگذارید؟</p>
                        </div>
                        <div className="grid gap-4 max-w-xl mx-auto">
                            {[
                                { id: "short", title: "کوتاه (۵-۱۰ دقیقه)", icon: Clock, desc: "یک سناریوی سریع برای مرور مفاهیم." },
                                { id: "medium", title: "استاندارد (۱۵-۲۰ دقیقه)", icon: Clock, desc: "تحلیل عمیق‌تر با جزئیات بیشتر." },
                                { id: "long", title: "چالش کامل (۳۰+ دقیقه)", icon: Clock, desc: "سناریوی پیچیده چندمرحله‌ای." },
                            ].map((item) => (
                                <Card
                                    key={item.id}
                                    onClick={() => select("duration", item.id)}
                                    className={cn(
                                        "p-4 flex items-center gap-4 cursor-pointer transition-all hover:border-primary/50",
                                        selections.duration === item.id ? "border-primary bg-primary/5" : "bg-card/50"
                                    )}
                                >
                                    <div className="p-3 bg-background rounded-lg border border-border">
                                        <item.icon className="size-5 text-muted-foreground" />
                                    </div>
                                    <div className="text-start">
                                        <h4 className="font-bold text-foreground">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 4: Final Form */}
                {currentStep === 4 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto">
                        <div className="text-center space-y-2 mb-8">
                            <h2 className="text-3xl font-bold">آماده شروع هستید؟</h2>
                            <p className="text-muted-foreground">خلاصه انتخاب‌های شما:</p>
                            <div className="flex justify-center gap-2 text-sm font-medium mt-4">
                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                                    {selections.goal === 'leadership' ? 'رهبری تیم' : selections.goal === 'communication' ? 'ارتباط موثر' : 'استراتژی'}
                                </span>
                                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full border border-accent/20">
                                    {selections.mode === 'evaluation' ? 'ارزیابی' : 'تمرین'}
                                </span>
                            </div>
                        </div>

                        <Card className="p-6 border-primary/20 bg-card/50 shadow-xl">
                            <StartAssessmentForm allowEmail={allowEmail} />
                        </Card>
                    </div>
                )}
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center pt-8 border-t border-border mt-auto">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className={cn(currentStep === 1 && "invisible")}
                >
                    <ArrowRight className="ml-2 size-4" />
                    بازگشت
                </Button>

                {currentStep < 4 ? (
                    <Button
                        onClick={handleNext}
                        disabled={
                            (currentStep === 1 && !selections.goal) ||
                            (currentStep === 2 && !selections.mode) ||
                            (currentStep === 3 && !selections.duration)
                        }
                        className="px-8"
                    >
                        مرحله بعد
                        <ArrowLeft className="mr-2 size-4" />
                    </Button>
                ) : null}
            </div>
        </div>
    );
}
