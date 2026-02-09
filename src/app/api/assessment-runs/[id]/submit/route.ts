
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { calculateScores, ScoringRuleWithCalc } from "@/lib/engine/scoring";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { answers, focusResults } = await req.json(); // answers: Record<questionId, value>

        // 1. Save answers
        if (answers && typeof answers === "object") {
            const answerData = Object.entries(answers).map(([qId, val]) => ({
                sessionId: id,
                questionId: qId,
                valueNumber: Number(val),
            }));

            // Use transaction or multiple creates
            // Simple loop for now to be safe
            for (const ans of answerData) {
                await prisma.answer.create({ data: ans });
            }
        }

        // 2. Save Focus Results if any
        if (focusResults) {
            await prisma.focusRun.create({
                data: {
                    sessionId: id,
                    durationMs: focusResults.duration || 0,
                    accuracy: focusResults.accuracy,
                    reactionAvgMs: focusResults.reactionAvg,
                    reactionStdMs: focusResults.reactionStd,
                    commission: focusResults.commission,
                    omission: focusResults.omission,
                    resultsJson: focusResults // save raw too
                }
            });
        }

        // 3. Fetch necessary data for scoring
        const session = await prisma.assessmentSession.findUnique({
            where: { id },
            include: {
                questionnaire: {
                    include: {
                        questions: true,
                        scoring: true
                    }
                },
                answers: true
            }
        });

        if (!session) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        // 4. Calculate Scores
        const responseMap = new Map<string, number>();
        session.answers.forEach(a => {
            if (a.valueNumber !== null) responseMap.set(a.questionId, a.valueNumber);
        });

        // We can merge memory answers with DB answers if needed, but assuming full submit for now
        // Actually the client sends `answers` which might be temporary. 
        // Let's assume `responseMap` is sufficient or we use `answers` from body
        if (answers) {
            Object.entries(answers).forEach(([k, v]) => responseMap.set(k, Number(v)));
        }

        const scores = calculateScores(
            responseMap,
            session.questionnaire.scoring as unknown as ScoringRuleWithCalc[],
            session.questionnaire.questions
        );

        // 5. Determine Global Risk Band (Higher of the two main scales)
        // Map standard bands to ordered values
        const bandValue = { "low": 1, "moderate": 2, "high": 3 };
        let maxRisk = 0;

        scores.forEach(s => {
            const val = bandValue[s.riskBand] || 0;
            if (val > maxRisk) maxRisk = val;
        });

        const globalRisk = maxRisk === 3 ? "HIGH" : (maxRisk === 2 ? "MODERATE" : "LOW");

        // 6. Generate Report (Mock Narrative for now)
        // Real implementation would call LLM here
        const narrative = `این گزارش بر اساس ${scores.length} شاخص محاسبه شده است. وضعیت کلی: ${globalRisk}. \n\n` +
            scores.map(s => `- ${s.subscale}: ${s.riskBand} (${s.score}/${s.maxScore})`).join("\n");


        const totalsJson: Prisma.InputJsonArray = scores.map(
            (s): Prisma.InputJsonObject => ({
                subscale: s.subscale,
                score: s.score,
                maxScore: s.maxScore,
                percentage: s.percentage,
                riskBand: s.riskBand,
            })
        );

        await prisma.assessmentSession.update({
            where: { id },
            data: {
                status: "COMPLETED",
                riskBand: globalRisk,
                totalsJson,
                completedAt: new Date(),
            }
        });

        await prisma.report.create({
            data: {
                sessionId: id,
                narrativeMd: narrative,
                modelInfoJson: { model: "rule-based-v1" }
            }
        });

        return NextResponse.json({ success: true, redirectUrl: `/report/${id}` });

    } catch (error) {
        console.error("Submit error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
