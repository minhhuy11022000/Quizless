"use client";

import { useMemo, useState, type SubmitEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LinkButton } from "@/components/ui/LinkButton";
import { checkAnswer } from "@/domain/study/checkAnswer";
import { defaultShuffle } from "@/domain/study/pickDistractors";
import { selectFillBlankCards } from "@/domain/study/selectFillBlankCards";
import type { Card } from "@/domain/types";

type Result = "correct" | "incorrect" | null;

export function FillBlankQuiz({ cards, setId }: { cards: Card[]; setId: string }) {
  const items = useMemo(() => defaultShuffle(selectFillBlankCards(cards)), [cards]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [score, setScore] = useState(0);

  const isDone = index >= items.length;
  if (isDone) {
    return (
      <div className="space-y-6 text-center">
        <p className="text-xl font-semibold">
          You scored {score} / {items.length}
        </p>
        <LinkButton href={`/sets/${setId}`} variant="secondary">
          Back to set
        </LinkButton>
      </div>
    );
  }

  const item = items[index];

  function submit(event: SubmitEvent) {
    event.preventDefault();
    if (result !== null) return;
    const correct = checkAnswer(answer, item.card.term);
    setResult(correct ? "correct" : "incorrect");
    if (correct) setScore((s) => s + 1);
  }

  function next() {
    setAnswer("");
    setResult(null);
    setIndex((i) => i + 1);
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {index + 1} of {items.length}
      </p>
      <p className="text-lg">{item.maskedSentence}</p>

      <form onSubmit={submit} className="space-y-3">
        <Input
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          disabled={result !== null}
          placeholder="Type the missing word"
          autoFocus
        />
        {result === null ? (
          <Button type="submit">Check</Button>
        ) : (
          <div className="space-y-3">
            <p
              className={
                result === "correct"
                  ? "text-sm text-green-600 dark:text-green-400"
                  : "text-sm text-red-600 dark:text-red-400"
              }
            >
              {result === "correct" ? "Correct!" : `The answer was "${item.card.term}".`}
            </p>
            <Button type="button" onClick={next}>
              {index === items.length - 1 ? "See results" : "Next"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
