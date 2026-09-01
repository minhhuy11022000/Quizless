/**
 * Fill-in-the-blank answer checking: exact match, case-insensitive, with
 * surrounding whitespace ignored. No fuzzy/typo tolerance in v1.
 */

export function checkAnswer(userAnswer: string, term: string): boolean {
  return normalize(userAnswer) === normalize(term);
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}
