import { setActivePromptAction, upsertPromptAction } from "@/app/(admin)/admin/(protected)/prompts/actions";
import { PromptPreviewForm } from "@/components/forms/prompt-preview-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { texts } from "@/lib/texts/fa";
import { toPersianDigits } from "@/lib/i18n/format";

export const runtime = "nodejs";

export default async function PromptsPage() {
  const [prompts, sessions] = await Promise.all([
    prisma.promptTemplate.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.assessmentSession.findMany({
      where: { status: "COMPLETE" },
      select: { id: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);
  const sessionOptions = sessions.map((session) => ({
    id: session.id,
    label: `${toPersianDigits(session.id.slice(0, 8))} · ${session.createdAt.toLocaleDateString("fa-IR")}`,
  }));
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">{texts.admin.prompts.title}</h1>
        <p className="text-sm text-slate-400">{texts.admin.prompts.subtitle}</p>
      </div>
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>{texts.admin.prompts.newVersion}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={upsertPromptAction} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{texts.admin.prompts.name}</Label>
                <Input name="name" required defaultValue="default-report" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" name="isActive" className="size-4" />
                <Label htmlFor="isActive">{texts.admin.prompts.activate}</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{texts.admin.prompts.systemPrompt}</Label>
              <Textarea name="systemPrompt" rows={4} required />
            </div>
            <div className="space-y-2">
              <Label>{texts.admin.prompts.userTemplate}</Label>
              <Textarea name="userTemplate" rows={6} required />
            </div>
            <Button type="submit">{texts.admin.prompts.save}</Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-2">
        {prompts.map((prompt) => (
          <Card key={prompt.id} className="border border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{prompt.name}</CardTitle>
                <p className="text-xs text-slate-400">نسخه {toPersianDigits(prompt.version)}</p>
              </div>
              <Badge variant={prompt.isActive ? "default" : "outline"}>
                {prompt.isActive ? "فعال" : "غیرفعال"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <pre className="max-h-48 overflow-auto rounded bg-slate-100 p-3 text-[10px]">
                {prompt.systemPrompt}
              </pre>
              <form action={setActivePromptAction}>
                <input type="hidden" name="promptId" value={prompt.id} />
                <Button type="submit" variant="outline" size="sm">
                  {texts.admin.prompts.activate}
                </Button>
              </form>
              <PromptPreviewForm promptId={prompt.id} sessions={sessionOptions} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
