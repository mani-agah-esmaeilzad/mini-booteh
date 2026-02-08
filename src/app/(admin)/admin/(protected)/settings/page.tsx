import { updateAppSettingsAction, updateFocusSettingsAction } from "@/app/(admin)/admin/(protected)/settings/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { texts } from "@/lib/texts/fa";
import { formatDate } from "@/lib/i18n/format";

const actionLabels: Record<string, string> = {
  QUESTIONNAIRE_UPSERT: "پرسشنامه ویرایش شد",
  QUESTION_UPSERT: "گویه‌ای به‌روزرسانی شد",
  SCORING_RULE_UPSERT: "قانون نمره‌گذاری ذخیره شد",
  PROMPT_VERSION_CREATED: "نسخه جدید روایت ساخته شد",
  PROMPT_ACTIVATED: "یک روایت فعال شد",
  APP_SETTINGS_UPDATED: "تنظیمات عمومی اصلاح شد",
  FOCUS_SETTINGS_UPDATED: "پارامترهای آزمون تمرکز به‌روزرسانی شد",
};

export const runtime = "nodejs";

export default async function SettingsPage() {
  const [appSettings, focusSettings, auditLogs] = await Promise.all([
    prisma.appSetting.findUnique({ where: { id: "app-setting" } }),
    prisma.focusTestSetting.findUnique({ where: { id: "focus-default" } }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { adminUser: { select: { email: true } } },
    }),
  ]);
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>{texts.admin.settings.appTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateAppSettingsAction} className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="allowUserEmail"
                className="size-4"
                defaultChecked={appSettings?.allowUserEmail}
              />
              <Label>{texts.admin.settings.allowEmail}</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="focusTestOptional"
                className="size-4"
                defaultChecked={appSettings?.focusTestOptional}
              />
              <Label>{texts.admin.settings.focusOptional}</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="enableShareLinks"
                className="size-4"
                defaultChecked={appSettings?.enableShareLinks}
              />
              <Label>{texts.admin.settings.shareLinks}</Label>
            </div>
            <div className="space-y-2">
              <Label>{texts.admin.settings.defaultLanguage}</Label>
              <Input name="defaultLanguage" defaultValue={appSettings?.defaultLanguage ?? "fa"} />
            </div>
            <div className="space-y-2">
              <Label>{texts.admin.settings.disclaimer}</Label>
              <Textarea
                name="disclaimerText"
                defaultValue={appSettings?.disclaimerText}
                rows={4}
              />
            </div>
            <Button type="submit">{texts.admin.settings.saveApp}</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>{texts.admin.settings.focusTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateFocusSettingsAction} className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{texts.admin.settings.duration}</Label>
                <Input
                  name="durationSeconds"
                  type="number"
                  defaultValue={focusSettings?.durationSeconds ?? 120}
                />
              </div>
              <div className="space-y-2">
                <Label>{texts.admin.settings.frequency}</Label>
                <Input
                  name="symbolFrequencyMs"
                  type="number"
                  defaultValue={focusSettings?.symbolFrequencyMs ?? 900}
                />
              </div>
              <div className="space-y-2">
                <Label>{texts.admin.settings.ratio}</Label>
                <Input
                  name="targetRatio"
                  type="number"
                  step="0.05"
                  defaultValue={focusSettings?.targetRatio ?? 0.35}
                />
              </div>
              <div className="space-y-2">
                <Label>{texts.admin.settings.targetSymbol}</Label>
                <Input name="targetSymbol" defaultValue={focusSettings?.targetSymbol ?? "X"} />
              </div>
              <div className="space-y-2">
                <Label>{texts.admin.settings.nonTargetSymbol}</Label>
                <Input
                  name="nonTargetSymbol"
                  defaultValue={focusSettings?.nonTargetSymbol ?? "O"}
                />
              </div>
            </div>
            <Button type="submit">{texts.admin.settings.saveFocus}</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2 border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>{texts.admin.settings.auditTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="rounded border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold">{actionLabels[log.action] ?? log.action}</p>
              <p className="text-slate-600">
                {log.adminUser?.email ?? "سیستم"} · {formatDate(log.createdAt)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
