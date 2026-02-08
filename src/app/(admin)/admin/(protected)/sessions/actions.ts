"use server";

import { revalidatePath } from "next/cache";

import { composeReport } from "@/lib/reporting";

export async function regenerateReportAction(formData: FormData) {
  const sessionId = formData.get("sessionId")?.toString();
  if (!sessionId) {
    throw new Error("شناسه نشست یافت نشد.");
  }
  await composeReport({ sessionId });
  revalidatePath("/admin/sessions");
  return;
}
