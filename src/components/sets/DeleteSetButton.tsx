"use client";

import { useTransition } from "react";

import { deleteSet } from "@/app/actions/sets";
import { Button } from "@/components/ui/Button";

export function DeleteSetButton({ setId }: { setId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="danger"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this set and all its cards? This can't be undone.")) return;
        startTransition(() => {
          deleteSet(setId);
        });
      }}
    >
      {pending ? "Deleting…" : "Delete"}
    </Button>
  );
}
