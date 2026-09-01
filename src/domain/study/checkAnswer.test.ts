import { describe, expect, it } from "vitest";
import { checkAnswer } from "./checkAnswer";

describe("checkAnswer", () => {
  it("accepts an exact match", () => {
    expect(checkAnswer("run", "run")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(checkAnswer("Run", "run")).toBe(true);
    expect(checkAnswer("RUN", "run")).toBe(true);
  });

  it("ignores surrounding whitespace", () => {
    expect(checkAnswer("  run  ", "run")).toBe(true);
  });

  it("rejects a different word", () => {
    expect(checkAnswer("walk", "run")).toBe(false);
  });

  it("rejects a typo (no fuzzy matching in v1)", () => {
    expect(checkAnswer("runn", "run")).toBe(false);
  });

  it("rejects an empty answer", () => {
    expect(checkAnswer("", "run")).toBe(false);
  });
});
