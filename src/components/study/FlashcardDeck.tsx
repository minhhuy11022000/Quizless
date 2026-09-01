"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import type { Card } from "@/domain/types";

export function FlashcardDeck({ cards, setId }: { cards: Card[]; setId: string }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = cards[index];
  const isFirst = index === 0;
  const isLast = index === cards.length - 1;

  function goNext() {
    setFlipped(false);
    setIndex((i) => Math.min(i + 1, cards.length - 1));
  }

  function goPrev() {
    setFlipped(false);
    setIndex((i) => Math.max(i - 1, 0));
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Card {index + 1} of {cards.length}
      </p>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="flex min-h-56 w-full flex-col items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
      >
        <span className="text-2xl font-semibold">{flipped ? card.definition : card.term}</span>
        {card.example ? (
          <span className="text-sm italic text-zinc-500 dark:text-zinc-400">
            “{card.example}”
          </span>
        ) : null}
        <span className="text-xs tracking-wide text-zinc-400 uppercase">Tap to flip</span>
      </button>

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={goPrev} disabled={isFirst}>
          Previous
        </Button>
        <LinkButton href={`/sets/${setId}`} variant="ghost">
          Exit
        </LinkButton>
        <Button variant="secondary" onClick={goNext} disabled={isLast}>
          Next
        </Button>
      </div>
    </div>
  );
}
