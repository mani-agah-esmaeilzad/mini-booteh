import type { Answer, ScoringRule } from "@prisma/client";
import { z } from "zod";

const calculationSchema = z.object({
  method: z.enum(["sum", "average"]).default("sum"),
  items: z
    .array(
      z.object({
        questionId: z.string(),
        weight: z.number().optional().default(1),
        reverse: z.boolean().optional().default(false),
      }),
    )
    .min(1),
  scale: z
    .object({
      min: z.number().default(0),
      max: z.number().default(36),
    })
    .optional(),
});

const thresholdSchema = z.object({
  label: z.string(),
  min: z.number().optional(),
  max: z.number().optional(),
  color: z.string().optional(),
  description: z.string().optional(),
});

export type SubscaleResult = {
  id: string;
  name: string;
  description?: string | null;
  rawScore: number;
  normalizedScore: number;
  method: "sum" | "average";
  thresholds?: RiskBandDefinition[];
  band?: RiskBandDefinition;
};

export type RiskBandDefinition = z.infer<typeof thresholdSchema>;

export type TotalsPayload = {
  subscales: SubscaleResult[];
  overallScore: number;
};

export function calculateSubscales({
  answers,
  scoringRules,
}: {
  answers: Answer[];
  scoringRules: ScoringRule[];
}): TotalsPayload {
  const answerMap = new Map<string, number>();
  answers.forEach((answer) => {
    if (typeof answer.valueNumber === "number") {
      answerMap.set(answer.questionId, answer.valueNumber);
    }
  });

  const subscales: SubscaleResult[] = scoringRules.map((rule) => {
    const calculation = calculationSchema.parse(rule.calculation);
    const thresholds = rule.thresholds
      ? z.array(thresholdSchema).safeParse(rule.thresholds).data ?? undefined
      : undefined;
    const values = calculation.items.map((item) => {
      const answerValue = answerMap.get(item.questionId) ?? 0;
      const adjusted = item.reverse ? Math.max(0, 4 - answerValue) : answerValue;
      return adjusted * (item.weight ?? 1);
    });
    const rawTotal =
      calculation.method === "average"
        ? values.reduce((acc, val) => acc + val, 0) / values.length
        : values.reduce((acc, val) => acc + val, 0);
    const scale = calculation.scale ?? { min: 0, max: 36 };
    const normalized = scale.max === scale.min ? rawTotal : (rawTotal / scale.max) * 100;
    const band = thresholds
      ? thresholds.find((t) => {
          const min = t.min ?? Number.NEGATIVE_INFINITY;
          const max = t.max ?? Number.POSITIVE_INFINITY;
          return rawTotal >= min && rawTotal < max;
        })
      : undefined;
    return {
      id: rule.id,
      name: rule.name,
      description: rule.description,
      rawScore: Number(rawTotal.toFixed(2)),
      normalizedScore: Number(normalized.toFixed(2)),
      method: calculation.method,
      thresholds,
      band,
    };
  });

  const overallScore =
    subscales.reduce((acc, item) => acc + item.normalizedScore, 0) /
    Math.max(1, subscales.length);

  return {
    subscales,
    overallScore: Number(overallScore.toFixed(2)),
  };
}

export function determineRiskBand({
  totals,
  defaults,
}: {
  totals: TotalsPayload;
  defaults?: RiskBandDefinition[];
}): RiskBandDefinition | undefined {
  if (!totals.subscales.length) {
    return undefined;
  }
  const targetBands =
    totals.subscales.flatMap((item) => item.thresholds ?? []) ?? defaults ?? [];
  if (!targetBands.length) {
    return undefined;
  }
  const sorted = [...targetBands].sort(
    (a, b) => (a.min ?? Number.NEGATIVE_INFINITY) - (b.min ?? Number.NEGATIVE_INFINITY),
  );
  const band = sorted.find((bandDef) => {
    const min = bandDef.min ?? Number.NEGATIVE_INFINITY;
    const max = bandDef.max ?? Number.POSITIVE_INFINITY;
    return totals.overallScore >= min && totals.overallScore < max;
  });
  return band ?? sorted.at(-1);
}
