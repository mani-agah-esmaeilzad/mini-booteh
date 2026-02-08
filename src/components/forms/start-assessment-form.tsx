"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { startAssessmentAction } from "@/app/(public)/start/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { texts } from "@/lib/texts/fa";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "در حال آماده‌سازی..." : texts.startForm.submit}
    </Button>
  );
}

export function StartAssessmentForm({
  allowEmail,
}: {
  allowEmail: boolean;
}) {
  const [state, formAction] = useActionState(startAssessmentAction, undefined);

  return (
    <form className="space-y-6" action={formAction}>
      {allowEmail ? (
        <div className="space-y-2">
          <Label htmlFor="email">{texts.startForm.emailLabel}</Label>
          <Input id="email" name="email" type="email" placeholder={texts.startForm.emailPlaceholder} autoComplete="email" />
          <p className="text-xs text-muted-foreground">{texts.startForm.emailHint}</p>
        </div>
      ) : null}
      <div className="flex items-start gap-3 rounded-md border bg-white p-4">
        <Checkbox id="consent" name="consent" required />
        <div className="space-y-1">
          <Label htmlFor="consent" className="font-medium">
            {texts.startForm.consentLabel}
          </Label>
          <p className="text-sm text-muted-foreground">{texts.startForm.consentDescription}</p>
        </div>
      </div>
      {state?.error ? (
        <p className="text-sm text-destructive">{state.error ?? texts.startForm.error}</p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
