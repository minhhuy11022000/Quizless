"use client";

import { useActionState } from "react";

import { idleFormState, type FormActionState } from "@/app/actions/types";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import type { StudySet } from "@/domain/types";

interface SetFormProps {
  action: (state: FormActionState, formData: FormData) => Promise<FormActionState>;
  defaultValues?: Pick<StudySet, "title" | "description">;
  submitLabel: string;
}

export function SetForm({ action, defaultValues, submitLabel }: SetFormProps) {
  const [state, formAction, pending] = useActionState(action, idleFormState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={defaultValues?.title} required />
      </div>
      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ""}
        />
      </div>
      <FieldError message={state.status === "error" ? state.message : undefined} />
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
