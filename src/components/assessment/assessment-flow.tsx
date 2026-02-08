"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from "recharts";
import { Controller, useForm } from "react-hook-form";
import { CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";

import type { FocusEvent, FocusMetrics } from "@/lib/focus";
import { buildReactionDistribution } from "@/lib/focus";
import type { TotalsPayload } from "@/lib/scoring";

import { FocusTest } from "@/components/assessment/focus-test";
import { LikertScale } from "@/components/assessment/likert-scale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { texts } from "@/lib/texts/fa";
import { toPersianDigits } from "@/lib/i18n/format";

type Question = {
  id: string;
  text: string;
  subscale?: string | null;
};

type Questionnaire = {
  id: string;
  title: string;
  description?: string | null;
  questions: Question[];
};

type FocusSettings = {
  durationSeconds: number;
  symbolFrequencyMs: number;
  targetRatio: number;
  targetSymbol: string;
  nonTargetSymbol: string;
};

type CompletionPayload = {
  shareToken: string;
  riskBand?: string;
  totals: TotalsPayload;
  focusMetrics?: FocusMetrics;
};

const answerSchema = z.object({
  answers: z.record(z.string(), z.number().min(0).max(4)),
});

const steps = texts.assessment.steps;

export function AssessmentFlow({
  sessionId,
  questionnaire,
  focusSettings,
  focusOptional,
}: {
  sessionId: string;
  questionnaire: Questionnaire;
  focusSettings: FocusSettings;
  focusOptional: boolean;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      answers: questionnaire.questions.reduce(
        (acc, question) => ({ ...acc, [question.id]: 2 }),
        {},
      ),
    },
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusResult, setFocusResult] = useState<{ metrics: FocusMetrics; events: FocusEvent[] }>();
  const [completion, setCompletion] = useState<CompletionPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reactionDistribution = useMemo(() => {
    if (!focusResult?.events) {
      return [];
    }
    const times = focusResult.events
      .filter((event) => event.responded && typeof event.reactionTimeMs === "number")
      .map((event) => event.reactionTimeMs ?? 0);
    return buildReactionDistribution(times);
  }, [focusResult]);

  const submitAnswers = async (values: z.infer<typeof answerSchema>) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/assessment/${sessionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.entries(values.answers).map(([questionId, value]) => ({
            questionId,
            value,
          })),
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error ?? "ذخیره پاسخ‌ها انجام نشد");
      }
      setCurrentStep(1);
    } catch (err) {
      console.error(err);
      setError(texts.assessment.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalizeReport = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/assessment/${sessionId}/complete`, {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "ساخت گزارش با خطا روبه‌رو شد");
      }
      setCompletion(data);
      setCurrentStep(2);
    } catch (err) {
      console.error(err);
      setError(texts.assessment.completeError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFocusComplete = (result: { metrics: FocusMetrics; events: FocusEvent[] }) => {
    setFocusResult(result);
    if (currentStep < 2) {
      setCurrentStep(2);
    }
  };

  const handleViewReport = () => {
    if (!completion) return;
    router.push(`/report/${completion.shareToken}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-2 text-sm font-medium">
            <Badge variant={index === currentStep ? "default" : "outline"}>
              {toPersianDigits(index + 1)}
            </Badge>
            <span className={index <= currentStep ? "text-foreground" : "text-muted-foreground"}>
              {step}
            </span>
          </div>
        ))}
      </div>
      {currentStep === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{questionnaire.title}</CardTitle>
            <CardDescription>{questionnaire.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(submitAnswers)}
            >
              {questionnaire.questions.map((question) => (
                <div key={question.id} className="space-y-3 rounded-lg border bg-white p-4 shadow-sm">
                  <div className="text-sm font-medium text-slate-900">
                    {question.text}
                    {question.subscale ? (
                      <span className="mr-2 text-xs uppercase tracking-wide text-muted-foreground">
                        {question.subscale}
                      </span>
                    ) : null}
                  </div>
                  <Controller
                    control={form.control}
                    name={`answers.${question.id}` as const}
                    render={({ field }) => (
                      <LikertScale value={field.value ?? 0} onChange={field.onChange} />
                    )}
                  />
                </div>
              ))}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {texts.assessment.saveAnswers}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {currentStep >= 1 && currentStep < 2 ? (
        <div className="space-y-6">
          <FocusTest
            sessionId={sessionId}
            settings={focusSettings}
            onComplete={handleFocusComplete}
          />
          {focusOptional ? (
            <Button variant="ghost" onClick={() => setCurrentStep(2)}>
              {texts.focusTest.skip}
            </Button>
          ) : null}
        </div>
      ) : null}

      {currentStep >= 2 ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{texts.assessment.generateTitle}</CardTitle>
              <CardDescription>{texts.assessment.generateDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={finalizeReport} disabled={isSubmitting} className="w-full">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {texts.assessment.generateButton}
              </Button>
              {completion ? (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {texts.assessment.successTitle} · {completion.riskBand ?? "—"}
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={completion.totals.subscales}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => toPersianDigits(value)} />
                        <Tooltip
                          formatter={(value: number | string | undefined) =>
                            toPersianDigits(
                              typeof value === "number" || typeof value === "string" ? value : 0,
                            )
                          }
                        />
                        <Bar dataKey="normalizedScore" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    {completion.focusMetrics ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={reactionDistribution}>
                          <defs>
                            <linearGradient id="reaction" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="bucket" />
                          <YAxis tickFormatter={(value) => toPersianDigits(value)} />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Tooltip
                            formatter={(value: number | string | undefined) =>
                              toPersianDigits(
                                typeof value === "number" || typeof value === "string" ? value : 0,
                              )
                            }
                          />
                          <Area
                            type="monotone"
                            dataKey="count"
                            stroke="hsl(var(--accent))"
                            fillOpacity={1}
                            fill="url(#reaction)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : null}
                    <Button variant="outline" onClick={handleViewReport} className="w-full">
                      {texts.assessment.viewReport}
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">{texts.assessment.successMsg}</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
