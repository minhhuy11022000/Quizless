"use client";

import { useActionState, useEffect, useRef } from "react";

import { createCard } from "@/app/actions/cards";
import { idleFormState } from "@/app/actions/types";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

export function CardForm({ setId }: { setId: string }) {
  const action = createCard.bind(null, setId);
  const [state, formAction, pending] = useActionState(action, idleFormState);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  // Reset the (uncontrolled) form after a successful add so the owner can
  // keep entering cards without the previous values lingering.
  useEffect(() => {
    if (wasPending.current && !pending && state.status !== "error") {
      formRef.current?.reset();
    }
    wasPending.current = pending;
  }, [pending, state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="term">Term</Label>
        <Input id="term" name="term" required />
      </div>
      <div>
        <Label htmlFor="definition">Definition</Label>
        <Textarea id="definition" name="definition" rows={2} required />
      </div>
      <div>
        <Label htmlFor="example">Example sentence (optional)</Label>
        <Textarea
          id="example"
          name="example"
          rows={2}
          placeholder="Use the term in a sentence to unlock fill-in-the-blank practice."
        />
      </div>
      <FieldError message={state.status === "error" ? state.message : undefined} />
      <Button type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add card"}
      </Button>
    </form>
  );
}
