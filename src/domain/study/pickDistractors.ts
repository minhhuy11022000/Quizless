/**
 * Multiple-choice distractor selection: given a set's cards and a target
 * card, pick up to `count` distractor definitions from the other cards in
 * the set. If fewer than `count` other cards exist, returns as many as are
 * available rather than throwing.
 *
 * The shuffle function is injected (defaults to a Fisher-Yates shuffle over
 * `Math.random`) so tests can supply a deterministic implementation instead
 * of stubbing global randomness.
 */

export interface DistractorSource {
  id: string;
  definition: string;
}

export type Shuffle = <T>(items: readonly T[]) => T[];

export const defaultShuffle: Shuffle = (items) => {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export function pickDistractors(
  cards: readonly DistractorSource[],
  targetCardId: string,
  count = 3,
  shuffle: Shuffle = defaultShuffle,
): string[] {
  const otherDefinitions = cards
    .filter((card) => card.id !== targetCardId)
    .map((card) => card.definition);

  return shuffle(otherDefinitions).slice(0, count);
}
