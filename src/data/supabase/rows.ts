import type { Card, StudySet } from "@/domain/types";

/** Raw row shapes as they come back from Supabase (snake_case, per the SQL schema). */

export interface SetRow {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  created_at: string;
}

export interface CardRow {
  id: string;
  set_id: string;
  term: string;
  definition: string;
  example: string | null;
  created_at: string;
}

export function setFromRow(row: SetRow): StudySet {
  return {
    id: row.id,
    ownerId: row.owner_id,
    title: row.title,
    description: row.description,
    createdAt: row.created_at,
  };
}

export function cardFromRow(row: CardRow): Card {
  return {
    id: row.id,
    setId: row.set_id,
    term: row.term,
    definition: row.definition,
    example: row.example,
    createdAt: row.created_at,
  };
}
