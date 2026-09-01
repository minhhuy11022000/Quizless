"use client";

import { useTransition } from "react";

import { deleteCard } from "@/app/actions/cards";
import { Button } from "@/components/ui/Button";

export function DeleteCardButton({ cardId }: { cardId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this card?")) return;
        startTransition(() => {
          deleteCard(cardId);
        });
      }}
    >
      {pending ? "Deleting…" : "Delete"}
    </Button>
  );
}
