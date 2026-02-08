export type FocusEvent = {
  timestamp: number;
  symbol: string;
  isTarget: boolean;
  responded: boolean;
  reactionTimeMs?: number;
};

export type FocusMetrics = {
  accuracy: number;
  reactionAvgMs: number;
  reactionStdMs: number;
  commissionErrors: number;
  omissionErrors: number;
  totalTargets: number;
  totalResponses: number;
};

export function evaluateFocusRun(events: FocusEvent[]): FocusMetrics {
  if (!events.length) {
    return {
      accuracy: 0,
      reactionAvgMs: 0,
      reactionStdMs: 0,
      commissionErrors: 0,
      omissionErrors: 0,
      totalTargets: 0,
      totalResponses: 0,
    };
  }
  const targets = events.filter((event) => event.isTarget);
  const nonTargets = events.filter((event) => !event.isTarget);
  const hits = targets.filter((event) => event.responded);
  const omissions = targets.length - hits.length;
  const commissions = nonTargets.filter((event) => event.responded).length;
  const reactionTimes = hits.flatMap((event) =>
    typeof event.reactionTimeMs === "number" ? [event.reactionTimeMs] : [],
  );
  const avg =
    reactionTimes.reduce((acc, val) => acc + val, 0) / Math.max(1, reactionTimes.length);
  const variance =
    reactionTimes.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) /
    Math.max(1, reactionTimes.length);
  const std = Math.sqrt(variance);
  const accuracy =
    (hits.length + (nonTargets.length - commissions)) / Math.max(1, events.length);

  return {
    accuracy: Number((accuracy * 100).toFixed(2)),
    reactionAvgMs: Number(avg.toFixed(2)),
    reactionStdMs: Number(std.toFixed(2)),
    commissionErrors: commissions,
    omissionErrors: omissions,
    totalTargets: targets.length,
    totalResponses: events.filter((event) => event.responded).length,
  };
}

import { toPersianDigits } from "@/lib/i18n/format";

export function buildReactionDistribution(
  reactionTimes: number[],
  binSize = 50,
): { bucket: string; count: number }[] {
  if (!reactionTimes.length) {
    return [];
  }
  const min = Math.min(...reactionTimes);
  const max = Math.max(...reactionTimes);
  const binCount = Math.max(5, Math.ceil((max - min) / binSize));
  const counts = new Array(binCount).fill(0);
  reactionTimes.forEach((time) => {
    const index = Math.min(binCount - 1, Math.floor((time - min) / binSize));
    counts[index] += 1;
  });
  return counts.map((count, idx) => {
    const start = min + idx * binSize;
    const end = start + binSize;
    return {
      bucket: `${toPersianDigits(Math.round(start))} تا ${toPersianDigits(Math.round(end))} میلی‌ثانیه`,
      count,
    };
  });
}
