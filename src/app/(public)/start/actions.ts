"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getAppSettings } from "@/lib/settings";
import { startAssessmentSchema } from "@/lib/validators/assessment";

function generateShareToken() {
  return randomBytes(24).toString("hex");
}

export async function startAssessmentAction(prevState: {
  error?: string;
} | undefined, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = startAssessmentSchema.safeParse({
    consent: raw.consent === "on" || raw.consent === "true",
    email: raw.email,
  });
  if (!parsed.success) {
    return { error: "برای ادامه باید رضایت را تایید کنی و در صورت وارد کردن ایمیل از قالب درست استفاده کنی." };
  }

  const [questionnaire, settings] = await Promise.all([
    prisma.questionnaire.findFirst({
      where: { isPublished: true },
      include: {
        questions: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    getAppSettings(),
  ]);

  if (!questionnaire) {
    return { error: "پرسشنامه‌ای منتشر نشده است. با پشتیبانی تماس بگیر." };
  }

  const session = await prisma.assessmentSession.create({
    data: {
      questionnaireId: questionnaire.id,
      consentGiven: true,
      userEmail: parsed.data.email,
      shareToken: settings.enableShareLinks ? generateShareToken() : null,
      language: "fa",
    },
  });

  redirect(`/assessment?sessionId=${session.id}`);
}
