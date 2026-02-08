import Link from "next/link";

import { texts } from "@/lib/texts/fa";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {texts.brand}
        </Link>
        <Link
          href="/start"
          className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          {texts.nav.start}
        </Link>
      </div>
    </header>
  );
}
