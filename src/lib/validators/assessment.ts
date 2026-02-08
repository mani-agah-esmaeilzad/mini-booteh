import { z } from "zod";

export const startAssessmentSchema = z.object({
  consent: z.literal(true),
  email: z
    .union([z.string().email("ایمیل واردشده معتبر نیست."), z.literal("")])
    .optional()
    .transform((value) => (value ? value : undefined)),
});

export const answerSchema = z.object({
  sessionId: z.string().min(1),
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        value: z.number().int().min(0).max(4),
      }),
    )
    .min(1),
});

export const focusEventSchema = z.object({
  timestamp: z.number(),
  symbol: z.string().min(1).max(4),
  isTarget: z.boolean(),
  responded: z.boolean(),
  reactionTimeMs: z.number().nonnegative().optional(),
});

export const focusPayloadSchema = z.object({
  sessionId: z.string().min(1),
  durationMs: z.number().positive(),
  events: z.array(focusEventSchema).min(1),
});

export const completeSessionSchema = z.object({
  sessionId: z.string().min(1),
});

export type StartAssessmentInput = z.infer<typeof startAssessmentSchema>;
export type AnswerInput = z.infer<typeof answerSchema>;
export type FocusPayloadInput = z.infer<typeof focusPayloadSchema>;
