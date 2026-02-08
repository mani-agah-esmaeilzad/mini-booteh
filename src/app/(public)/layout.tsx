import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getAppSettings } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const settings = await getAppSettings();
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter disclaimer={settings.disclaimerText} />
    </div>
  );
}
