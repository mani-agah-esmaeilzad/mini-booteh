"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { adminLoginAction } from "@/app/(admin)/admin/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { texts } from "@/lib/texts/fa";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "در حال ورود..." : texts.admin.login.submit}
    </Button>
  );
}

export function AdminLoginForm() {
  const [state, formAction] = useActionState(adminLoginAction, undefined);
  return (
    <form className="space-y-4" action={formAction}>
      <div className="space-y-2">
        <Label htmlFor="email">{texts.admin.login.email}</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{texts.admin.login.password}</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      {state?.error ? <p className="text-sm text-red-500">{texts.admin.login.error}</p> : null}
      <SubmitButton />
    </form>
  );
}
