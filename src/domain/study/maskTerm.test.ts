import { describe, expect, it } from "vitest";
import { maskTerm } from "./maskTerm";

describe("maskTerm", () => {
  it("masks the first whole-word occurrence, case-insensitively", () => {
    const result = maskTerm("The Cat sat on the mat.", "cat");
    expect(result).toEqual({ maskedSentence: "The ___ sat on the mat.", found: true });
  });

  it("does not match a term that is a substring of a longer word", () => {
    const result = maskTerm("I checked the catalog for cat food.", "cat");
    // Should skip "catalog" and match the whole word "cat" later in the sentence.
    expect(result.found).toBe(true);
    expect(result.maskedSentence).toBe("I checked the catalog for ___ food.");
  });

  it("reports not found when the term never appears as a whole word", () => {
    const result = maskTerm("She ran every morning.", "run");
    expect(result).toEqual({ maskedSentence: "She ran every morning.", found: false });
  });

  it("masks only the first of multiple occurrences", () => {
    const result = maskTerm("A dog chased another dog.", "dog");
    expect(result).toEqual({ maskedSentence: "A ___ chased another dog.", found: true });
  });

  it("escapes regex special characters in the term", () => {
    const result = maskTerm("Remember 3.14 as an approximation of pi.", "3.14");
    // Without escaping, "." would match any character (e.g. "3x14") — this
    // confirms the literal "." is required, not "any character".
    expect(result).toEqual({
      maskedSentence: "Remember ____ as an approximation of pi.",
      found: true,
    });
    expect(maskTerm("Remember 3x14 as a typo.", "3.14").found).toBe(false);
  });

  it("handles multi-word terms", () => {
    const result = maskTerm("I love ice cream on a hot day.", "ice cream");
    expect(result).toEqual({
      maskedSentence: "I love _________ on a hot day.",
      found: true,
    });
  });

  it("reports not found for a blank term", () => {
    const result = maskTerm("Some sentence.", "   ");
    expect(result.found).toBe(false);
  });
});
