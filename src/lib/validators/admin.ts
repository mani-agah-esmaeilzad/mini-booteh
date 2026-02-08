import { z } from "zod";

export const upsertQuestionnaireSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  description: z.string().optional(),
  isPublished: z.boolean().optional().default(false),
});

export const upsertQuestionSchema = z.object({
  id: z.string().optional(),
  questionnaireId: z.string().min(1),
  text: z.string().min(3),
  type: z.enum(["LIKERT", "BOOLEAN", "TEXT"]).default("LIKERT"),
  subscale: z.string().optional(),
  reverse: z.boolean().optional().default(false),
  order: z.number().int().nonnegative().optional(),
  options: z
    .array(z.object({ label: z.string(), value: z.number() }))
    .optional(),
});

export const upsertScoringRuleSchema = z.object({
  id: z.string().optional(),
  questionnaireId: z.string(),
  name: z.string().min(2),
  description: z.string().optional(),
  calculation: z.object({
    method: z.enum(["sum", "average"]),
    items: z.array(
      z.object({
        questionId: z.string(),
        weight: z.number().optional(),
        reverse: z.boolean().optional(),
      }),
    ),
    scale: z
      .object({
        min: z.number(),
        max: z.number(),
      })
      .optional(),
  }),
  thresholds: z
    .array(
      z.object({
        label: z.string(),
        min: z.number().optional(),
        max: z.number().optional(),
        color: z.string().optional(),
      }),
    )
    .optional(),
});

export const upsertPromptSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  systemPrompt: z.string().min(10),
  userTemplate: z.string().min(10),
  isActive: z.boolean().optional(),
});

export const focusSettingSchema = z.object({
  durationSeconds: z.number().int().positive().max(600),
  symbolFrequencyMs: z.number().int().min(300),
  targetRatio: z.number().min(0.1).max(0.9),
  targetSymbol: z.string().min(1).max(2),
  nonTargetSymbol: z.string().min(1).max(2),
});

export const appSettingSchema = z.object({
  allowUserEmail: z.boolean(),
  focusTestOptional: z.boolean(),
  defaultLanguage: z.string().min(2),
  disclaimerText: z.string().min(20),
  enableShareLinks: z.boolean(),
});

export const promptPreviewSchema = z.object({
  sessionId: z.string(),
  promptTemplateId: z.string(),
});
