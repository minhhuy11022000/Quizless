import { describe, expect, it } from "vitest";
import { pickDistractors, type Shuffle } from "./pickDistractors";

// A deterministic "shuffle" that just returns the input unchanged, so tests
// can assert on exact output without stubbing Math.random.
const identityShuffle: Shuffle = (items) => items.slice();

describe("pickDistractors", () => {
  const cards = [
    { id: "1", definition: "def-1" },
    { id: "2", definition: "def-2" },
    { id: "3", definition: "def-3" },
    { id: "4", definition: "def-4" },
  ];

  it("excludes the target card's own definition", () => {
    const distractors = pickDistractors(cards, "1", 3, identityShuffle);
    expect(distractors).not.toContain("def-1");
    expect(distractors).toEqual(["def-2", "def-3", "def-4"]);
  });

  it("returns at most `count` distractors", () => {
    const distractors = pickDistractors(cards, "1", 2, identityShuffle);
    expect(distractors).toHaveLength(2);
  });

  it("returns fewer than `count` when not enough other cards exist", () => {
    const smallSet = cards.slice(0, 2); // only 2 cards total
    const distractors = pickDistractors(smallSet, "1", 3, identityShuffle);
    expect(distractors).toEqual(["def-2"]);
  });

  it("returns an empty array when the target is the only card", () => {
    const distractors = pickDistractors([cards[0]], "1", 3, identityShuffle);
    expect(distractors).toEqual([]);
  });

  it("uses the injected shuffle function", () => {
    const reverseShuffle: Shuffle = (items) => items.slice().reverse();
    const distractors = pickDistractors(cards, "1", 3, reverseShuffle);
    expect(distractors).toEqual(["def-4", "def-3", "def-2"]);
  });

  it("defaults to producing a shuffled result without a supplied shuffle fn", () => {
    const distractors = pickDistractors(cards, "1");
    expect(distractors).toHaveLength(3);
    expect(distractors).not.toContain("def-1");
  });
});
