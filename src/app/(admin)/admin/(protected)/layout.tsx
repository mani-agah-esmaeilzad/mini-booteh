import Link from "next/link";
import type { ReactNode } from "react";

import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { texts } from "@/lib/texts/fa";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        <aside className="w-64 border-r border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xl font-semibold text-slate-900">{texts.admin.layout.title}</p>
          <nav className="mt-6 space-y-3 text-sm">
            <Link className="block text-slate-600 transition hover:text-slate-900" href="/admin">
              {texts.admin.layout.dashboard}
            </Link>
            <Link className="block text-slate-600 transition hover:text-slate-900" href="/admin/questionnaires">
              {texts.admin.layout.questionnaires}
            </Link>
            <Link className="block text-slate-600 transition hover:text-slate-900" href="/admin/prompts">
              {texts.admin.layout.prompts}
            </Link>
            <Link className="block text-slate-600 transition hover:text-slate-900" href="/admin/sessions">
              {texts.admin.layout.sessions}
            </Link>
            <Link className="block text-slate-600 transition hover:text-slate-900" href="/admin/settings">
              {texts.admin.layout.settings}
            </Link>
          </nav>
          {session?.user ? (
            <form action={handleSignOut} className="mt-8">
              <Button type="submit" variant="outline" className="w-full">
                {texts.admin.layout.signOut}
              </Button>
            </form>
          ) : null}
        </aside>
        <main className="flex-1 bg-slate-50 p-8 text-slate-900">{children}</main>
      </div>
    </div>
  );
}
