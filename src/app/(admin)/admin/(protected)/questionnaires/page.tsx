import {
  upsertQuestionAction,
  upsertQuestionnaireAction,
  upsertScoringRuleAction,
} from "@/app/(admin)/admin/(protected)/questionnaires/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { texts } from "@/lib/texts/fa";

export const runtime = "nodejs";

export default async function QuestionnairesPage() {
  const questionnaires = await prisma.questionnaire.findMany({
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
      scoring: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">{texts.admin.questionnaires.title}</h1>
        <p className="text-sm text-slate-400">{texts.admin.questionnaires.subtitle}</p>
      </div>
      <Card className="border border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>{texts.admin.questionnaires.createTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={upsertQuestionnaireAction} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">{texts.admin.questionnaires.fields.title}</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{texts.admin.questionnaires.fields.description}</Label>
              <Textarea id="description" name="description" className="min-h-[80px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isPublished" className="inline-flex items-center gap-2 text-sm">
                <input id="isPublished" name="isPublished" type="checkbox" className="size-4" />{" "}
                {texts.admin.questionnaires.fields.publish}
              </Label>
            </div>
            <Button type="submit">{texts.admin.questionnaires.fields.save}</Button>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-6">
        {questionnaires.map((questionnaire) => (
          <Card key={questionnaire.id} className="border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{questionnaire.title}</CardTitle>
                  <p className="text-sm text-slate-400">{questionnaire.description}</p>
                </div>
                <Badge variant={questionnaire.isPublished ? "default" : "outline"}>
                  {questionnaire.isPublished ? "منتشر شده" : "پیش‌نویس"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  گویه‌ها
                </h3>
                {questionnaire.questions.map((question) => (
                  <div key={question.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                    <p className="font-medium text-slate-900">{question.text}</p>
                    <p className="text-xs text-slate-500">
                      {texts.admin.questionnaires.questionMeta(
                        question.subscale ?? "بدون خرده‌مقیاس",
                        question.order,
                      )}
                    </p>
                  </div>
                ))}
                <form action={upsertQuestionAction} className="grid gap-3 rounded-lg border border-dashed border-slate-300 bg-white p-4">
                  <input type="hidden" name="questionnaireId" value={questionnaire.id} />
                  <div className="space-y-2">
                    <Label>{texts.admin.questionnaires.fields.questionText}</Label>
                    <Textarea name="text" required />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <Label>{texts.admin.questionnaires.fields.subscale}</Label>
                      <Input name="subscale" placeholder="بی‌توجهی" />
                    </div>
                    <div className="w-24 space-y-2">
                      <Label>{texts.admin.questionnaires.fields.order}</Label>
                      <Input name="order" type="number" defaultValue={questionnaire.questions.length + 1} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input id={`reverse-${questionnaire.id}`} name="reverse" type="checkbox" className="size-4" />
                    <Label htmlFor={`reverse-${questionnaire.id}`} className="text-sm">
                      {texts.admin.questionnaires.fields.reverse}
                    </Label>
                  </div>
                  <Button type="submit" size="sm">
                    {texts.admin.questionnaires.fields.addQuestion}
                  </Button>
                </form>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                    {texts.admin.questionnaires.fields.scoring}
                  </h4>
                  {questionnaire.scoring.map((rule) => (
                    <div key={rule.id} className="rounded border border-slate-200 bg-slate-50 p-3 text-xs">
                      <p className="font-semibold text-slate-900">{rule.name}</p>
                      <p className="text-slate-600">{rule.description}</p>
                    </div>
                  ))}
                  <p className="text-xs text-slate-500">{texts.admin.questionnaires.fields.itemsPlaceholder}</p>
                  <form action={upsertScoringRuleAction} className="grid gap-2 rounded border border-dashed border-slate-300 bg-white p-3 text-xs">
                    <input type="hidden" name="questionnaireId" value={questionnaire.id} />
                    <Label>{texts.admin.questionnaires.fields.title}</Label>
                    <Input name="name" required />
                    <Label>{texts.admin.questionnaires.fields.description}</Label>
                    <Textarea name="description" rows={2} />
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <Label>{texts.admin.questionnaires.fields.method}</Label>
                        <Input name="method" placeholder="sum یا average" required />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label>{texts.admin.questionnaires.fields.scaleMin}</Label>
                          <Input name="min" type="number" />
                        </div>
                        <div className="flex-1">
                          <Label>{texts.admin.questionnaires.fields.scaleMax}</Label>
                          <Input name="max" type="number" />
                        </div>
                      </div>
                    </div>
                    <Label>{texts.admin.questionnaires.fields.itemsPlaceholder}</Label>
                    <Textarea
                      name="items"
                      defaultValue='[{"questionId":"","weight":1,"reverse":false}]'
                    />
                    <Label>{texts.admin.questionnaires.fields.thresholdsPlaceholder}</Label>
                    <Textarea
                      name="thresholds"
                      defaultValue='[{"label":"low","min":0,"max":30},{"label":"high","min":30}]'
                    />
                    <Button type="submit" size="sm">
                      {texts.admin.questionnaires.fields.saveRule}
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
