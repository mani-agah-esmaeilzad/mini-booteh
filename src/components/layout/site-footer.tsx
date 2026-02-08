import { texts } from "@/lib/texts/fa";

export function SiteFooter({ disclaimer }: { disclaimer: string }) {
  return (
    <footer className="border-t bg-white">
      <div className="container py-8 text-sm text-muted-foreground">
        <p>{disclaimer}</p>
        <p className="mt-3 text-xs">{texts.footer.crisis}</p>
      </div>
    </footer>
  );
}
