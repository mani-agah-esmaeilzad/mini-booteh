
import { Metadata } from "next";
import { getAppSettings } from "@/lib/settings";
import { texts } from "@/lib/texts/fa";
import { StartWizard } from "./components/StartWizard";

export const metadata: Metadata = {
  title: `${texts.brand} | شروع سنجش`,
  description: texts.startPage.description,
};

export default async function StartPage() {
  const settings = await getAppSettings();

  return (
    <div className="min-h-screen bg-background flex flex-col pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <StartWizard allowEmail={settings.allowUserEmail} />
      </div>
    </div>
  );
}
