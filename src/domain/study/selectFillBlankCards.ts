import type { Card } from "../types";
import { maskTerm } from "./maskTerm";

export interface FillBlankCard {
  card: Card;
  maskedSentence: string;
}

/**
 * Filters a set's cards down to the ones eligible for fill-in-the-blank:
 * a non-null example whose term appears in it as a whole word. Cards that
 * fail either condition are skipped rather than shown unmasked.
 */
export function selectFillBlankCards(cards: readonly Card[]): FillBlankCard[] {
  const eligible: FillBlankCard[] = [];

  for (const card of cards) {
    if (!card.example) continue;

    const { maskedSentence, found } = maskTerm(card.example, card.term);
    if (found) {
      eligible.push({ card, maskedSentence });
    }
  }

  return eligible;
}
