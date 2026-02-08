"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from "recharts";
import { CheckCircle2, Loader2 } from "lucide-react";

import type { FocusEvent, FocusMetrics } from "@/lib/focus";
import { buildReactionDistribution } from "@/lib/focus";
import type { TotalsPayload } from "@/lib/scoring";

import { AiChat } from "@/components/assessment/ai-chat";
import { FocusTest } from "@/components/assessment/focus-test";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { texts } from "@/lib/texts/fa";
import { toPersianDigits } from "@/lib/i18n/format";

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

const steps = texts.assessment.steps;

export function AssessmentFlow({
  sessionId,
  focusSettings,
  focusOptional,
}: {
  sessionId: string;
  focusSettings: FocusSettings;
  focusOptional: boolean;
}) {
  const router = useRouter();
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

  const handleChatComplete = () => {
    if (currentStep < 1) {
      setCurrentStep(1);
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
        <AiChat sessionId={sessionId} onComplete={handleChatComplete} />
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
