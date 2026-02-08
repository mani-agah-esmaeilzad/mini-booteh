import { cache } from "react";

import { prisma } from "@/lib/prisma";

export const getAppSettings = cache(async () => {
  const settings = await prisma.appSetting.findUnique({
    where: { id: "app-setting" },
  });
  return (
    settings ?? {
      id: "app-setting",
      allowUserEmail: false,
      focusTestOptional: true,
      defaultLanguage: "fa",
      disclaimerText:
        "این غربالگری نقش تشخیص پزشکی ندارد و فقط برای آگاهی شخصی ارائه می‌شود.",
      enableShareLinks: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );
});

export const getFocusTestSettings = cache(async () => {
  const settings = await prisma.focusTestSetting.findUnique({
    where: { id: "focus-default" },
  });
  return (
    settings ?? {
      id: "focus-default",
      durationSeconds: 120,
      symbolFrequencyMs: 900,
      targetRatio: 0.35,
      targetSymbol: "X",
      nonTargetSymbol: "O",
      thresholds: null,
      variabilityBands: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );
});
