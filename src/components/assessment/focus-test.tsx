"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PauseCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { FocusEvent, FocusMetrics } from "@/lib/focus";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { texts } from "@/lib/texts/fa";
import { toPersianDigits } from "@/lib/i18n/format";

type FocusSettings = {
  durationSeconds: number;
  symbolFrequencyMs: number;
  targetRatio: number;
  targetSymbol: string;
  nonTargetSymbol: string;
};

type SequenceItem = {
  symbol: string;
  isTarget: boolean;
};

type Props = {
  sessionId: string;
  settings: FocusSettings;
  onComplete: (result: { metrics: FocusMetrics; events: FocusEvent[] }) => void;
};

function buildSequence(length: number, settings: FocusSettings) {
  const result: SequenceItem[] = [];
  for (let i = 0; i < length; i += 1) {
    const isTarget = Math.random() < settings.targetRatio;
    result.push({
      symbol: isTarget ? settings.targetSymbol : settings.nonTargetSymbol,
      isTarget,
    });
  }
  return result;
}

export function FocusTest({ sessionId, settings, onComplete }: Props) {
  const totalTrials = Math.max(
    10,
    Math.floor((settings.durationSeconds * 1000) / settings.symbolFrequencyMs),
  );
  const sequence = useMemo(() => buildSequence(totalTrials, settings), [totalTrials, settings]);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentEvent, setCurrentEvent] = useState<FocusEvent | null>(null);
  const [events, setEvents] = useState<FocusEvent[]>([]);
  const [metrics, setMetrics] = useState<FocusMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const appearedAt = useRef<number | null>(null);

  const pushCurrentEvent = useCallback(() => {
    setEvents((prev) => {
      if (!currentEvent) return prev;
      return [...prev, currentEvent];
    });
    setCurrentEvent(null);
    appearedAt.current = null;
  }, [currentEvent]);

  const advance = useCallback(() => {
    if (!isRunning) {
      return;
    }
    if (currentEvent) {
      pushCurrentEvent();
    }
    if (currentIndex + 1 >= sequence.length) {
      setIsRunning(false);
      setIsFinished(true);
      return;
    }
    const nextIndex = currentIndex + 1;
    const next = sequence[nextIndex];
    appearedAt.current = Date.now();
    setCurrentIndex(nextIndex);
    setCurrentEvent({
      timestamp: Date.now(),
      symbol: next.symbol,
      isTarget: next.isTarget,
      responded: false,
    });
  }, [currentEvent, currentIndex, isRunning, pushCurrentEvent, sequence]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }
    const timeout = setTimeout(() => {
      advance();
    }, settings.symbolFrequencyMs);
    return () => clearTimeout(timeout);
  }, [advance, isRunning, currentIndex, settings.symbolFrequencyMs]);

  useEffect(() => {
    if (!isRunning || !currentEvent) {
      return;
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.code !== "Space") {
        return;
      }
      event.preventDefault();
      if (currentEvent.responded) {
        return;
      }
      const reaction = appearedAt.current ? Date.now() - appearedAt.current : undefined;
      setCurrentEvent((existing) =>
        existing
          ? {
              ...existing,
              responded: true,
              reactionTimeMs: reaction,
            }
          : existing,
      );
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentEvent, isRunning]);

  useEffect(() => {
    if (!isFinished) {
      return;
    }
    if (currentEvent) {
      pushCurrentEvent();
    }
    if (!events.length) {
      return;
    }
    const sendResults = async () => {
      try {
        const response = await fetch(`/api/assessment/${sessionId}/focus`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            durationMs: settings.durationSeconds * 1000,
            events: events,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error ?? "خطای ذخیره آزمون تمرکز");
        }
        setMetrics(data.metrics);
        onComplete({ metrics: data.metrics, events });
      } catch (err) {
        console.error(err);
        setError(texts.focusTest.error);
      }
    };
    void sendResults();
  }, [currentEvent, events, isFinished, onComplete, sessionId, settings.durationSeconds, pushCurrentEvent]);

  const handleStart = () => {
    setEvents([]);
    setMetrics(null);
    setError(null);
    setIsFinished(false);
    setIsRunning(true);
    setCurrentIndex(0);
    setCurrentEvent({
      timestamp: Date.now(),
      symbol: sequence[0].symbol,
      isTarget: sequence[0].isTarget,
      responded: false,
    });
    appearedAt.current = Date.now();
  };

  return (
    <Card>
      <CardContent className="space-y-6 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          {texts.focusTest.instructions} نماد هدف: {settings.targetSymbol} · نماد غیرهدف:{" "}
          {settings.nonTargetSymbol} · مدت آزمون: {toPersianDigits(settings.durationSeconds)} ثانیه
        </p>
        <div className="flex flex-col items-center gap-4">
          {!isRunning && !isFinished ? (
            <Button onClick={handleStart} size="lg">
              {texts.focusTest.start}
            </Button>
          ) : null}
          {isRunning ? (
            <div className="flex flex-col items-center gap-3">
              <div className="text-sm text-muted-foreground">
                {texts.focusTest.trialsLabel} {toPersianDigits(currentIndex + 1)} /{" "}
                {toPersianDigits(sequence.length)}
              </div>
              <Progress value={((currentIndex + 1) / sequence.length) * 100} />
              <div className="flex h-40 w-40 items-center justify-center rounded-2xl border bg-slate-900 text-white text-6xl font-semibold shadow-inner">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentEvent?.symbol ?? "idle"}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentEvent?.symbol}
                  </motion.span>
                </AnimatePresence>
              </div>
              <p className="text-xs tracking-wide text-muted-foreground">{texts.focusTest.pressSpace}</p>
            </div>
          ) : null}
          {isFinished ? (
            <div className="space-y-2 text-center">
              <PauseCircle className="mx-auto h-10 w-10 text-primary" />
              <p className="font-medium">{texts.focusTest.completed}</p>
              {metrics ? (
                <p className="text-sm text-muted-foreground">
                  {texts.focusTest.summary({
                    accuracy: toPersianDigits(metrics.accuracy),
                    reaction: toPersianDigits(metrics.reactionAvgMs),
                    variability: toPersianDigits(metrics.reactionStdMs),
                  })}
                </p>
              ) : (
                <Skeleton className="mx-auto h-6 w-40" />
              )}
            </div>
          ) : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
