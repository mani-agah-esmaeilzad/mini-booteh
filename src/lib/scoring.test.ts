import { describe, expect, it } from "vitest";

import type { Answer, ScoringRule } from "@prisma/client";

import { calculateSubscales, determineRiskBand } from "@/lib/scoring";

const answers: Answer[] = [
  {
    id: "a1",
    sessionId: "s1",
    questionId: "q1",
    valueNumber: 3,
    rawValue: null,
    createdAt: new Date(),
  },
  {
    id: "a2",
    sessionId: "s1",
    questionId: "q2",
    valueNumber: 1,
    rawValue: null,
    createdAt: new Date(),
  },
];

const scoringRules: ScoringRule[] = [
  {
    id: "rule1",
    questionnaireId: "q-set",
    name: "Test scale",
    description: "Adds q1 + q2",
    calculation: {
      method: "sum",
      items: [
        { questionId: "q1", reverse: false },
        { questionId: "q2", reverse: true },
      ],
      scale: { min: 0, max: 8 },
    },
    thresholds: [
      { label: "Low", min: 0, max: 3 },
      { label: "Moderate", min: 3, max: 5 },
      { label: "High", min: 5 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("calculateSubscales", () => {
  it("computes normalized scores and reverse scoring", () => {
    const result = calculateSubscales({ answers, scoringRules });
    expect(result.subscales).toHaveLength(1);
    expect(result.subscales[0].rawScore).toBeCloseTo(6); // 3 + (4-1)
    expect(result.subscales[0].normalizedScore).toBeCloseTo(75);
  });
});

describe("determineRiskBand", () => {
  it("returns matching threshold", () => {
    const totals = calculateSubscales({ answers, scoringRules });
    const band = determineRiskBand({ totals });
    expect(band?.label).toBe("High");
  });
});
