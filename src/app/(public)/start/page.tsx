
import { Metadata } from "next";
import { getAppSettings, getFocusTestSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma"; // ensure this path is correct
import { texts } from "@/lib/texts/fa";
import { StartWizard } from "./components/StartWizard";

export const metadata: Metadata = {
  title: `${texts.brand} | شروع سنجش`,
  description: texts.startPage.description,
};

export const dynamic = 'force-dynamic';

export default async function StartPage() {
  const [settings, focusSettings, questionnaire] = await Promise.all([
    getAppSettings(),
    getFocusTestSettings(),
    prisma.questionnaire.findFirst({
      where: { isPublished: true },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    })
  ]);

  return (
    <div className="min-h-screen bg-background flex flex-col pt-24 pb-20 px-4">
      <div className="container mx-auto">
        <StartWizard
          allowEmail={settings.allowUserEmail}
          appSettings={settings}
          focusSettings={focusSettings}
          questionnaire={questionnaire}
        />
      </div>
    </div>
  );
}
