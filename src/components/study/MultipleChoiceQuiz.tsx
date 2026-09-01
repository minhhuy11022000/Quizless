"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import type { Card } from "@/domain/types";
import { defaultShuffle, pickDistractors } from "@/domain/study/pickDistractors";
import { cn } from "@/lib/cn";

interface Question {
  card: Card;
  options: string[];
}

function buildQuestions(cards: Card[]): Question[] {
  return defaultShuffle(cards).map((card) => {
    const distractors = pickDistractors(cards, card.id, 3);
    return { card, options: defaultShuffle([card.definition, ...distractors]) };
  });
}

export function MultipleChoiceQuiz({ cards, setId }: { cards: Card[]; setId: string }) {
  // Computed once per mount (`cards` is stable for the lifetime of a study
  // session), so a fresh shuffle isn't warranted on every render.
  const questions = useMemo(() => buildQuestions(cards), [cards]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const isDone = index >= questions.length;
  if (isDone) {
    return (
      <div className="space-y-6 text-center">
        <p className="text-xl font-semibold">
          You scored {score} / {questions.length}
        </p>
        <LinkButton href={`/sets/${setId}`} variant="secondary">
          Back to set
        </LinkButton>
      </div>
    );
  }

  const question = questions[index];

  function choose(option: string) {
    if (selected !== null) return;
    setSelected(option);
    if (option === question.card.definition) {
      setScore((s) => s + 1);
    }
  }

  function next() {
    setSelected(null);
    setIndex((i) => i + 1);
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Question {index + 1} of {questions.length}
      </p>
      <h2 className="text-xl font-semibold">{question.card.term}</h2>

      <div className="space-y-2">
        {question.options.map((option) => {
          const isCorrect = option === question.card.definition;
          const isSelected = option === selected;
          return (
            <button
              key={option}
              type="button"
              onClick={() => choose(option)}
              disabled={selected !== null}
              className={cn(
                "block w-full rounded-md border p-3 text-left text-sm transition-colors",
                selected === null &&
                  "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600",
                selected !== null &&
                  isCorrect &&
                  "border-green-500 bg-green-50 dark:bg-green-950",
                selected !== null &&
                  isSelected &&
                  !isCorrect &&
                  "border-red-500 bg-red-50 dark:bg-red-950",
                selected !== null &&
                  !isCorrect &&
                  !isSelected &&
                  "border-zinc-200 opacity-60 dark:border-zinc-800",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected !== null ? (
        <Button onClick={next}>{index === questions.length - 1 ? "See results" : "Next"}</Button>
      ) : null}
    </div>
  );
}
