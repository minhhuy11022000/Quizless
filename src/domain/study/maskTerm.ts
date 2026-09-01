/**
 * Fill-in-the-blank masking: given an example sentence and the term it
 * illustrates, blank out the term's first whole-word occurrence.
 *
 * Matching is case-insensitive and word-boundary based, so "cat" matches
 * "Cat" but not "catalog". If the term doesn't appear as a whole word (e.g.
 * a different inflection, "ran" for term "run"), `found` is false and the
 * caller should skip the card for this mode rather than show it unmasked.
 */

export interface MaskResult {
  maskedSentence: string;
  found: boolean;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function maskTerm(example: string, term: string): MaskResult {
  const trimmedTerm = term.trim();
  if (trimmedTerm === "") {
    return { maskedSentence: example, found: false };
  }

  const pattern = new RegExp(`\\b${escapeRegExp(trimmedTerm)}\\b`, "i");
  const match = pattern.exec(example);

  if (!match) {
    return { maskedSentence: example, found: false };
  }

  const blank = "_".repeat(match[0].length);
  const maskedSentence =
    example.slice(0, match.index) + blank + example.slice(match.index + match[0].length);

  return { maskedSentence, found: true };
}
