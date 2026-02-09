
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { questionnaireId } = await req.json();

        // Find the default questionnaire if not provided
        let qId = questionnaireId;
        if (!qId) {
            const q = await prisma.questionnaire.findFirst({
                where: { isPublished: true },
                select: { id: true }
            });
            if (q) qId = q.id;
        }

        if (!qId) {
            return NextResponse.json({ error: "No active questionnaire found" }, { status: 404 });
        }

        const session = await prisma.assessmentSession.create({
            data: {
                questionnaireId: qId,
                status: "IN_PROGRESS",
            },
        });

        return NextResponse.json(session);
    } catch (error) {
        console.error("Failed to create session:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
