import { Metadata } from "next";
import { ClipboardList, ShieldAlert, Timer } from "lucide-react";

import { StartAssessmentForm } from "@/components/forms/start-assessment-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAppSettings } from "@/lib/settings";
import { texts } from "@/lib/texts/fa";

const highlightIcons = [ClipboardList, Timer, ShieldAlert];

export const metadata: Metadata = {
  title: `${texts.brand} | شروع سنجش`,
  description: texts.startPage.description,
};

export default async function StartPage() {
  const settings = await getAppSettings();
  return (
    <div className="container grid gap-10 py-16 lg:grid-cols-[1.1fr,0.9fr]">
      <div className="space-y-6">
        <Badge variant="outline">{texts.startPage.badge}</Badge>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">{texts.startPage.title}</h1>
        <p className="text-lg text-slate-600">{texts.startPage.description}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {texts.startPage.highlights.map((item, index) => {
            const Icon = highlightIcons[index];
            return (
              <Card key={item.title}>
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{item.description}</CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{texts.startPage.consentTitle}</CardTitle>
          <p className="text-sm text-muted-foreground">{texts.startPage.consentDescription}</p>
        </CardHeader>
        <CardContent>
          <StartAssessmentForm allowEmail={settings.allowUserEmail} />
        </CardContent>
      </Card>
    </div>
  );
}
