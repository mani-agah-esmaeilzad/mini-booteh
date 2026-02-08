"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { recordAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import {
  upsertQuestionSchema,
  upsertQuestionnaireSchema,
  upsertScoringRuleSchema,
} from "@/lib/validators/admin";

export async function upsertQuestionnaireAction(formData: FormData) {
  const parsed = upsertQuestionnaireSchema.safeParse({
    id: formData.get("id")?.toString(),
    title: formData.get("title"),
    description: formData.get("description"),
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) {
    throw new Error("داده‌های پرسشنامه معتبر نیست.");
  }
  const questionnaire = parsed.data.id
    ? await prisma.questionnaire.update({
        where: { id: parsed.data.id },
        data: {
          title: parsed.data.title,
          description: parsed.data.description,
          isPublished: parsed.data.isPublished ?? false,
        },
      })
    : await prisma.questionnaire.create({
        data: {
          title: parsed.data.title,
          description: parsed.data.description,
          isPublished: parsed.data.isPublished ?? false,
        },
      });
  const session = await auth();
  await recordAuditLog({
    adminId: session?.user.id,
    action: "QUESTIONNAIRE_UPSERT",
    metadata: { questionnaireId: questionnaire.id },
  });
  revalidatePath("/admin/questionnaires");
  return;
}

export async function upsertQuestionAction(formData: FormData) {
  const parsed = upsertQuestionSchema.safeParse({
    id: formData.get("id")?.toString(),
    questionnaireId: formData.get("questionnaireId"),
    text: formData.get("text"),
    type: formData.get("type"),
    subscale: formData.get("subscale"),
    reverse: formData.get("reverse") === "on",
    order: Number(formData.get("order") ?? 0),
  });
  if (!parsed.success) {
    throw new Error("اطلاعات سؤال معتبر نیست.");
  }
  const question = parsed.data.id
    ? await prisma.question.update({
        where: { id: parsed.data.id },
        data: {
          text: parsed.data.text,
          type: parsed.data.type,
          subscale: parsed.data.subscale,
          reverse: parsed.data.reverse,
          order: parsed.data.order ?? 0,
        },
      })
    : await prisma.question.create({
        data: {
          questionnaireId: parsed.data.questionnaireId,
          text: parsed.data.text,
          type: parsed.data.type,
          subscale: parsed.data.subscale,
          reverse: parsed.data.reverse,
          order: parsed.data.order ?? 0,
        },
      });
  const session = await auth();
  await recordAuditLog({
    adminId: session?.user.id,
    action: "QUESTION_UPSERT",
    metadata: { questionId: question.id },
  });
  revalidatePath("/admin/questionnaires");
  return;
}

export async function upsertScoringRuleAction(formData: FormData) {
  const items = JSON.parse(formData.get("items")?.toString() ?? "[]");
  const thresholds = JSON.parse(formData.get("thresholds")?.toString() ?? "[]");
  const parsed = upsertScoringRuleSchema.safeParse({
    id: formData.get("id")?.toString(),
    questionnaireId: formData.get("questionnaireId"),
    name: formData.get("name"),
    description: formData.get("description"),
    calculation: {
      method: formData.get("method"),
      items,
      scale: formData.get("min") && formData.get("max") ? { min: Number(formData.get("min")), max: Number(formData.get("max")) } : undefined,
    },
    thresholds,
  });
  if (!parsed.success) {
    throw new Error("قانون نمره‌گذاری معتبر نیست.");
  }
  const scoringRule = parsed.data.id
    ? await prisma.scoringRule.update({
        where: { id: parsed.data.id },
        data: {
          name: parsed.data.name,
          description: parsed.data.description,
          calculation: parsed.data.calculation,
          thresholds: parsed.data.thresholds,
        },
      })
    : await prisma.scoringRule.create({
        data: {
          questionnaireId: parsed.data.questionnaireId,
          name: parsed.data.name,
          description: parsed.data.description,
          calculation: parsed.data.calculation,
          thresholds: parsed.data.thresholds,
        },
      });
  const session = await auth();
  await recordAuditLog({
    adminId: session?.user.id,
    action: "SCORING_RULE_UPSERT",
    metadata: { scoringRuleId: scoringRule.id },
  });
  revalidatePath("/admin/questionnaires");
  return;
}
