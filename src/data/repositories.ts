import "server-only";

import { createClient } from "@/lib/supabase/server";
import { SupabaseCardsRepository } from "./supabase/SupabaseCardsRepository";
import { SupabaseSetsRepository } from "./supabase/SupabaseSetsRepository";

/**
 * Composition root for the data layer: the one place that decides which
 * concrete repository implementations back the app. Server Actions and
 * Server Components call this instead of constructing repositories (or a
 * Supabase client) themselves.
 */
export async function createRepositories() {
  const supabase = await createClient();

  return {
    sets: new SupabaseSetsRepository(supabase),
    cards: new SupabaseCardsRepository(supabase),
  };
}
