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

// Shared between the live question view and the post-test review: given
// whether an option is the correct answer and whether it's the one that was
// picked, decide how it should be highlighted. `answered` distinguishes "not
// yet answered, so no highlighting" (live view before a pick) from "answered
// elsewhere" (review view, always highlighted).
function optionClassName(isCorrect: boolean, isPicked: boolean, answered: boolean) {
  return cn(
    "block w-full rounded-md border p-3 text-left text-sm transition-colors",
    !answered &&
      "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600",
    answered && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950",
    answered && isPicked && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950",
    answered && !isCorrect && !isPicked && "border-zinc-200 opacity-60 dark:border-zinc-800",
  );
}

export function MultipleChoiceQuiz({ cards, setId }: { cards: Card[]; setId: string }) {
  // Computed once per mount (`cards` is stable for the lifetime of a study
  // session), so a fresh shuffle isn't warranted on every render.
  const questions = useMemo(() => buildQuestions(cards), [cards]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  // The option picked for each question, in question order, so the review
  // screen can show every question's outcome after the test is done.
  const [answers, setAnswers] = useState<string[]>([]);

  const isDone = index >= questions.length;
  if (isDone) {
    const score = answers.filter((answer, i) => answer === questions[i].card.definition).length;
    return (
      <div className="space-y-8">
        <p className="text-center text-xl font-semibold">
          You scored {score} / {questions.length}
        </p>

        <div className="space-y-6">
          {questions.map((question, i) => (
            <div key={question.card.id} className="space-y-2">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Question {i + 1} of {questions.length}
              </p>
              <h3 className="text-lg font-semibold">{question.card.term}</h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {question.options.map((option) => (
                  <div
                    key={option}
                    className={optionClassName(
                      option === question.card.definition,
                      option === answers[i],
                      true,
                    )}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <LinkButton href={`/sets/${setId}`} variant="secondary">
            Back to set
          </LinkButton>
        </div>
      </div>
    );
  }

  const question = questions[index];

  function choose(option: string) {
    if (selected !== null) return;
    setSelected(option);
    setAnswers((prev) => [...prev, option]);
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

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => choose(option)}
            disabled={selected !== null}
            className={optionClassName(
              option === question.card.definition,
              option === selected,
              selected !== null,
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {selected !== null ? (
        <Button onClick={next}>{index === questions.length - 1 ? "See results" : "Next"}</Button>
      ) : null}
    </div>
  );
}
