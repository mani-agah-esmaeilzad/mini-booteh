"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { recordAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { appSettingSchema, focusSettingSchema } from "@/lib/validators/admin";

export async function updateAppSettingsAction(formData: FormData) {
  const parsed = appSettingSchema.safeParse({
    allowUserEmail: formData.get("allowUserEmail") === "on",
    focusTestOptional: formData.get("focusTestOptional") === "on",
    defaultLanguage: formData.get("defaultLanguage"),
    disclaimerText: formData.get("disclaimerText"),
    enableShareLinks: formData.get("enableShareLinks") === "on",
  });
  if (!parsed.success) {
    throw new Error("تنظیمات ارسالی معتبر نیست.");
  }
  await prisma.appSetting.upsert({
    where: { id: "app-setting" },
    create: parsed.data,
    update: parsed.data,
  });
  const session = await auth();
  await recordAuditLog({
    adminId: session?.user.id,
    action: "APP_SETTINGS_UPDATED",
  });
  revalidatePath("/admin/settings");
  return;
}

export async function updateFocusSettingsAction(formData: FormData) {
  const parsed = focusSettingSchema.safeParse({
    durationSeconds: Number(formData.get("durationSeconds")),
    symbolFrequencyMs: Number(formData.get("symbolFrequencyMs")),
    targetRatio: Number(formData.get("targetRatio")),
    targetSymbol: formData.get("targetSymbol"),
    nonTargetSymbol: formData.get("nonTargetSymbol"),
  });
  if (!parsed.success) {
    throw new Error("تنظیمات آزمون تمرکز معتبر نیست.");
  }
  await prisma.focusTestSetting.upsert({
    where: { id: "focus-default" },
    create: parsed.data,
    update: parsed.data,
  });
  const session = await auth();
  await recordAuditLog({
    adminId: session?.user.id,
    action: "FOCUS_SETTINGS_UPDATED",
  });
  revalidatePath("/admin/settings");
  return;
}
