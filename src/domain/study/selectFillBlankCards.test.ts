import { describe, expect, it } from "vitest";
import { selectFillBlankCards } from "./selectFillBlankCards";
import type { Card } from "../types";

function makeCard(overrides: Partial<Card>): Card {
  return {
    id: "id",
    setId: "set",
    term: "term",
    definition: "definition",
    example: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("selectFillBlankCards", () => {
  it("skips cards with no example", () => {
    const cards = [makeCard({ id: "1", term: "run", example: null })];
    expect(selectFillBlankCards(cards)).toEqual([]);
  });

  it("skips cards whose term doesn't appear as a whole word in the example", () => {
    const cards = [makeCard({ id: "1", term: "run", example: "She ran every morning." })];
    expect(selectFillBlankCards(cards)).toEqual([]);
  });

  it("includes cards whose term matches, with the masked sentence", () => {
    const cards = [
      makeCard({ id: "1", term: "cat", example: "The cat sat on the mat." }),
    ];
    const result = selectFillBlankCards(cards);
    expect(result).toEqual([
      { card: cards[0], maskedSentence: "The ___ sat on the mat." },
    ]);
  });

  it("filters a mixed set down to only the eligible cards", () => {
    const eligible = makeCard({ id: "1", term: "cat", example: "The cat sat down." });
    const noExample = makeCard({ id: "2", term: "dog", example: null });
    const noMatch = makeCard({ id: "3", term: "run", example: "She ran fast." });

    const result = selectFillBlankCards([eligible, noExample, noMatch]);
    expect(result.map((r) => r.card.id)).toEqual(["1"]);
  });
});
