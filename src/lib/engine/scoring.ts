import { QuestionType } from "@prisma/client";

export type QuestionWithOrder = {
    id: string;
    order: number;
    subscale: string | null;
    reverse: boolean;
    type: QuestionType;
};

export type ScoringRuleWithCalc = {
    id: string;
    name: string;
    calculation: any; // specific to json structure
    thresholds: any; // specific to json structure
};

export interface ScoreResult {
    subscale: string;
    score: number;
    maxScore: number;
    percentage: number;
    riskBand: "low" | "moderate" | "high";
}

/**
 * Calculates scores based on responses and rules.
 */
export function calculateScores(
    responses: Map<string, number>, // questionId -> value
    rules: ScoringRuleWithCalc[],
    questions: QuestionWithOrder[]
): ScoreResult[] {
    const results: ScoreResult[] = [];

    for (const rule of rules) {
        const calc = rule.calculation;
        if (!calc || !calc.items || !Array.isArray(calc.items)) continue;

        let totalScore = 0;
        let count = 0;

        // items usually looks like [{ questionId: "..." }, ...]
        for (const item of calc.items) {
            const qId = item.questionId;
            const val = responses.get(qId);
            if (typeof val === "number") {
                totalScore += val;
                count++;
            }
        }

        // Determine scale max
        const method = calc.method || "sum";
        const scaleMax = calc.scale?.max || (count * 4); // Default assumption: max val 4 per item

        // If method is average
        let finalMetric = totalScore;
        if (method === "average" && count > 0) {
            finalMetric = totalScore / count;
        }

        // Determine Risk Band
        let riskBand: "low" | "moderate" | "high" = "low";
        if (rule.thresholds && Array.isArray(rule.thresholds)) {
            for (const t of rule.thresholds) {
                if (t.min !== undefined && finalMetric >= t.min) {
                    if (t.max === undefined || finalMetric <= t.max) {
                        // clean mapping from label to standard keys
                        const label = t.label?.toLowerCase();
                        if (label === "low" || label === "کم") riskBand = "low";
                        else if (label === "moderate" || label === "medium" || label === "متوسط") riskBand = "moderate";
                        else if (label === "high" || label === "ziad" || label === "زیاد") riskBand = "high";
                    }
                }
            }
        }

        results.push({
            subscale: rule.name,
            score: finalMetric,
            maxScore: scaleMax,
            percentage: scaleMax > 0 ? (finalMetric / scaleMax) * 100 : 0,
            riskBand,
        });
    }

    return results;
}
