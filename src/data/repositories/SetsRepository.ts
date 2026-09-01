import type { NewSetInput, StudySet, UpdateSetInput } from "@/domain/types";

/**
 * Storage-agnostic contract for study-set persistence. Server Actions and
 * pages depend on this interface, not on Supabase directly (Dependency
 * Inversion) — swapping the backing store means writing a new
 * implementation, not touching call sites.
 */
export interface SetsRepository {
  listSets(): Promise<StudySet[]>;
  getSetById(id: string): Promise<StudySet | null>;
  createSet(ownerId: string, input: NewSetInput): Promise<StudySet>;
  updateSet(id: string, input: UpdateSetInput): Promise<StudySet>;
  deleteSet(id: string): Promise<void>;
}
