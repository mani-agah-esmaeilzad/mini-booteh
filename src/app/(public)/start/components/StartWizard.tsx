
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Loader2, Play, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type { Question, Questionnaire } from "@prisma/client";
import { FocusTest } from "@/components/assessment/focus-test";
import { LikertScale } from "@/components/assessment/likert-scale";

interface StartWizardProps {
    allowEmail: boolean;
    questionnaire: (Questionnaire & { questions: Question[] }) | null;
    focusSettings: any;
    appSettings: any;
}

const STEPS = ["جلسه معرفی", "اطلاعات پایه", "تست پرسشنامه‌ای", "تست تمرکز"];

export function StartWizard({ allowEmail, questionnaire, focusSettings, appSettings }: StartWizardProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);

    // State
    const [consentGiven, setConsentGiven] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [group, setGroup] = useState<string>("adult");
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [focusResults, setFocusResults] = useState<any>(null);

    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize session on start (transition from Step 1 to 2)
    const createSession = async () => {
        try {
            setIsSubmitting(true);
            const res = await fetch("/api/assessment-runs", {
                method: "POST",
                body: JSON.stringify({ questionnaireId: questionnaire?.id }),
            });
            if (!res.ok) throw new Error("Failed to start session");
            const data = await res.json();
            setSessionId(data.id);
            setCurrentStep(2); // Go to Questions
        } catch (e) {
            console.error(e);
            alert("خطا در ایجاد نشست. لطفاً دوباره تلاش کنید.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const submitFinal = async () => {
        if (!sessionId) return;
        try {
            setIsSubmitting(true);
            const res = await fetch(`/api/assessment-runs/${sessionId}/submit`, {
                method: "POST",
                body: JSON.stringify({
                    answers,
                    focusResults,
                    group // saving group as metadata if needed, though mostly for logic selection later
                }),
            });
            const data = await res.json();
            if (data.redirectUrl) {
                router.push(data.redirectUrl);
            }
        } catch (e) {
            console.error(e);
            alert("خطا در ثبت نهایی. لطفاً دوباره تلاش کنید.");
            setIsSubmitting(false);
        }
    };

    const questions = questionnaire?.questions || [];
    const progress = (Object.keys(answers).length / questions.length) * 100;

    // -- Render Helpers --

    const renderConsent = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold bg-gradient-to-l from-primary to-primary/60 bg-clip-text text-transparent">
                    شناخت الگوی تمرکز
                </h1>
                <p className="text-muted-foreground text-lg">
                    مسیر خودشناسی از اینجا شروع می‌شود.
                </p>
            </div>

            <Card className="border-destructive/20 bg-destructive/5">
                <CardContent className="pt-6 flex gap-4 items-start">
                    <ShieldAlert className="w-6 h-6 text-destructive shrink-0 mt-1" />
                    <div className="space-y-2">
                        <h3 className="font-bold text-destructive">سلب مسئولیت مهم</h3>
                        <p className="text-sm text-foreground/80 leading-relaxed text-justify">
                            {appSettings.disclaimerText}
                            <br />
                            این ابزار صرفاً یک چک‌لیست غربالگری است و به هیچ وجه جایگزین تشخیص پزشک متخصص نیست.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4 p-4 border rounded-xl bg-card">
                <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="consent" checked={consentGiven} onCheckedChange={(c) => setConsentGiven(!!c)} />
                    <Label htmlFor="consent" className="cursor-pointer">
                        می‌دانم که این یک ابزار غربالگری است و نه تشخیص پزشکی.
                    </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="privacy" checked={privacyAccepted} onCheckedChange={(c) => setPrivacyAccepted(!!c)} />
                    <Label htmlFor="privacy" className="cursor-pointer">
                        قوانین حریم خصوصی را می‌پذیرم (داده‌ها ناشناس پردازش می‌شوند).
                    </Label>
                </div>
            </div>

            <Button
                size="lg"
                className="w-full text-lg h-12"
                disabled={!consentGiven || !privacyAccepted}
                onClick={() => setCurrentStep(1)}
            >
                شروع مسیر
                <ArrowLeft className="mr-2 w-5 h-5" />
            </Button>
        </div>
    );

    const renderGroupSelection = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">برای چه کسی پرسشنامه را پر می‌کنید؟</h2>
                <p className="text-muted-foreground">این انتخاب سوالات را متناسب با شرایط شما تغییر می‌دهد.</p>
            </div>

            <RadioGroup value={group} onValueChange={setGroup} className="grid sm:grid-cols-3 gap-4">
                {[
                    { id: "adult", label: "بزرگسال (خودم)", desc: "۱۸ سال به بالا" },
                    { id: "teen", label: "نوجوان", desc: "۱۲ تا ۱۷ سال (غیرفعال در دمو)", disabled: true },
                    { id: "child", label: "کودک", desc: "۵ تا ۱۱ سال (توسط والد - غیرفعال)", disabled: true }
                ].map(item => (
                    <div key={item.id}>
                        <RadioGroupItem value={item.id} id={item.id} className="peer sr-only" disabled={item.disabled} />
                        <Label htmlFor={item.id} className={`flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <span className="text-xl mb-2">👤</span>
                            <span className="font-semibold">{item.label}</span>
                            <span className="text-xs text-muted-foreground mt-1">{item.desc}</span>
                        </Label>
                    </div>
                ))}
            </RadioGroup>

            <div className="flex gap-4">
                <Button variant="ghost" onClick={() => setCurrentStep(0)}>بازگشت</Button>
                <Button className="flex-1" onClick={createSession} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : "ادامه"}
                </Button>
            </div>
        </div>
    );

    const renderQuestions = () => {
        // Basic "All in one page" or "Step by step" logic. 
        // Let's do a smooth list for UX, auto-scroll or just a clean list.
        // For "Wizard" feel, let's do 1 by 1 or sections. 
        // Given the request for "Wizard", let's do a clean list with smooth scroll or just standard form.
        // Standard list is easier for user to review.

        const unansweredCount = questions.length - Object.keys(answers).length;

        return (
            <div className="space-y-8 animate-in fade-in">
                <div className="sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-muted-foreground">پیشرفت پاسخ‌دهی</span>
                        <span className="text-sm font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                <div className="space-y-6">
                    {questions.map((q, idx) => (
                        <Card key={q.id} className={`transition-all duration-300 ${answers[q.id] !== undefined ? 'border-primary/50 bg-primary/5' : 'border-border'}`}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg font-medium leading-relaxed">
                                    <span className="text-primary/50 ml-2">#{idx + 1}</span>
                                    {q.text}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <LikertScale
                                    value={answers[q.id] ?? null}
                                    onChange={(val) => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="pt-8 pb-20">
                    <Button
                        size="lg"
                        className="w-full"
                        disabled={unansweredCount > 0}
                        onClick={() => setCurrentStep(3)}
                    >
                        {unansweredCount > 0
                            ? `${unansweredCount} سوال باقی مانده`
                            : "پایان سوالات و مرحله بعد"}
                    </Button>
                </div>
            </div>
        );
    };

    const renderFocusTest = () => (
        <div className="space-y-6 animate-in fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">تست تمرکز (Optional)</h2>
                <p className="text-muted-foreground">
                    این تست کوتاه (۲ دقیقه) سرعت واکنش و دقت شما را می‌سنجد.
                    <br />
                    انجام آن برای دریافت گزارش کامل پیشنهاد می‌شود.
                </p>
            </div>

            {sessionId && (
                <FocusTest
                    sessionId={sessionId}
                    settings={{
                        ...focusSettings,
                        durationSeconds: focusSettings.durationSeconds || 60 // fallback
                    }}
                    onComplete={(res) => {
                        setFocusResults(res);
                        // Auto submit after test
                        // Wait a moment for UX
                        setTimeout(() => submitFinal(), 500); // trigger final submit logic which uses state
                    }}
                />
            )}

            {/* If test completed locally or skipped */}
            <div className="flex justify-center pt-4">
                {!focusResults && (
                    <Button variant="ghost" onClick={() => submitFinal()}>
                        فعلاً رد کردن این مرحله
                    </Button>
                )}
                {focusResults && (
                    <Button onClick={() => submitFinal()} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="mr-2 animate-spin" /> : null}
                        مشاهده نتیجه نهایی
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto min-h-[600px] py-6">
            <div className="mb-8 flex justify-center space-x-2 space-x-reverse">
                {STEPS.map((s, i) => (
                    <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= currentStep ? 'bg-primary' : 'bg-muted'}`} />
                ))}
            </div>

            <AnimatePresence mode="wait">
                {currentStep === 0 && <motion.div key="step0" exit={{ opacity: 0, x: -20 }}>{renderConsent()}</motion.div>}
                {currentStep === 1 && <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderGroupSelection()}</motion.div>}
                {currentStep === 2 && <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderQuestions()}</motion.div>}
                {currentStep === 3 && <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>{renderFocusTest()}</motion.div>}
            </AnimatePresence>
        </div>
    );
}
