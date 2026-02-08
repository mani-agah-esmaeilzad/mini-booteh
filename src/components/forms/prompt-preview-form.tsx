"use client";

import { useFormState, useFormStatus } from "react-dom";

import { previewPromptAction } from "@/app/(admin)/admin/(protected)/prompts/actions";
import { Button } from "@/components/ui/button";
import { texts } from "@/lib/texts/fa";

type SessionOption = {
  id: string;
  label: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="secondary" size="sm" disabled={pending}>
      {pending ? "در حال تولید..." : texts.admin.prompts.dryRun}
    </Button>
  );
}

export function PromptPreviewForm({
  promptId,
  sessions,
}: {
  promptId: string;
  sessions: SessionOption[];
}) {
  const [state, formAction] = useFormState(previewPromptAction, undefined);
  return (
    <form action={formAction} className="space-y-2 text-xs">
      <input type="hidden" name="promptTemplateId" value={promptId} />
      <label className="text-[11px] uppercase tracking-wide text-slate-400">
        {texts.admin.prompts.previewLabel}
      </label>
      <select
        name="sessionId"
        className="w-full rounded border border-white/20 bg-transparent p-2 text-xs"
      >
        {sessions.map((session) => (
          <option key={session.id} value={session.id} className="text-black">
            {session.label}
          </option>
        ))}
      </select>
      <SubmitButton />
      {state?.preview ? (
        <pre className="max-h-40 overflow-auto rounded border border-white/10 p-2 text-left">
          {state.preview}
        </pre>
      ) : null}
      {state?.error ? <p className="text-red-400">{state.error}</p> : null}
    </form>
  );
}
