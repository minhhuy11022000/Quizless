"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import type { Card } from "@/domain/types";
import { CardEditForm } from "./CardEditForm";
import { DeleteCardButton } from "./DeleteCardButton";

export function CardListItem({ card, editable }: { card: Card; editable: boolean }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return <CardEditForm card={card} onDone={() => setIsEditing(false)} />;
  }

  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium">{card.term}</p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{card.definition}</p>
          {card.example ? (
            <p className="mt-2 text-sm italic text-zinc-500 dark:text-zinc-500">
              “{card.example}”
            </p>
          ) : null}
        </div>
        {editable ? (
          <div className="flex shrink-0 gap-2">
            <Button variant="ghost" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <DeleteCardButton cardId={card.id} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
