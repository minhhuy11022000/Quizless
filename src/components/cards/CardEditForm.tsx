"use client";

import { useActionState, useEffect, useRef } from "react";

import { updateCard } from "@/app/actions/cards";
import { idleFormState } from "@/app/actions/types";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import type { Card } from "@/domain/types";

export function CardEditForm({ card, onDone }: { card: Card; onDone: () => void }) {
  const action = updateCard.bind(null, card.id);
  const [state, formAction, pending] = useActionState(action, idleFormState);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && state.status !== "error") {
      onDone();
    }
    wasPending.current = pending;
  }, [pending, state, onDone]);

  return (
    <form
      action={formAction}
      className="space-y-3 rounded-lg border border-zinc-300 p-4 dark:border-zinc-700"
    >
      <div>
        <Label htmlFor={`term-${card.id}`}>Term</Label>
        <Input id={`term-${card.id}`} name="term" defaultValue={card.term} required />
      </div>
      <div>
        <Label htmlFor={`definition-${card.id}`}>Definition</Label>
        <Textarea
          id={`definition-${card.id}`}
          name="definition"
          rows={2}
          defaultValue={card.definition}
          required
        />
      </div>
      <div>
        <Label htmlFor={`example-${card.id}`}>Example sentence (optional)</Label>
        <Textarea
          id={`example-${card.id}`}
          name="example"
          rows={2}
          defaultValue={card.example ?? ""}
        />
      </div>
      <FieldError message={state.status === "error" ? state.message : undefined} />
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
