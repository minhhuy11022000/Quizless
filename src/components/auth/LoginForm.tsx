"use client";

import { useActionState } from "react";

import { signInWithMagicLink } from "@/app/actions/auth";
import { idleMagicLinkState } from "@/app/actions/types";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export function LoginForm() {
  const [state, action, pending] = useActionState(signInWithMagicLink, idleMagicLinkState);

  if (state.status === "sent") {
    return (
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        Check your email for a magic link to sign in.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        <FieldError message={state.status === "error" ? state.message : undefined} />
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Sending…" : "Send magic link"}
      </Button>
    </form>
  );
}
