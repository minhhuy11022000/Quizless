import type { StudySet } from "./types";

/** Ownership rule: only a set's owner may create/edit/delete its cards. */
export function isSetOwner(set: Pick<StudySet, "ownerId">, userId: string): boolean {
  return set.ownerId === userId;
}
