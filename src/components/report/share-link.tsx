"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { texts } from "@/lib/texts/fa";

export function ShareLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <Button type="button" variant="outline" onClick={handleCopy}>
      {copied ? texts.share.copied : texts.share.copy}
    </Button>
  );
}
