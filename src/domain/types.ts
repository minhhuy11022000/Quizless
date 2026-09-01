/**
 * Core domain types. These describe the shape of the app's data independent
 * of how it is stored (Supabase) or rendered (React) — nothing in this file
 * or the rest of `src/domain` should import from Next.js or Supabase.
 */

export interface StudySet {
  id: string;
  ownerId: string;
  title: string;
  description: string | null;
  createdAt: string;
}

export interface Card {
  id: string;
  setId: string;
  term: string;
  definition: string;
  /** Optional example sentence. A non-null example makes the card eligible
   * for fill-in-the-blank study. */
  example: string | null;
  createdAt: string;
}

export interface NewSetInput {
  title: string;
  description: string | null;
}

export interface UpdateSetInput {
  title: string;
  description: string | null;
}

export interface NewCardInput {
  setId: string;
  term: string;
  definition: string;
  example: string | null;
}

export interface UpdateCardInput {
  term: string;
  definition: string;
  example: string | null;
}

export type StudyMode = "flashcards" | "test" | "fill-blank";
