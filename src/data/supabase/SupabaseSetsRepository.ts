import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { NewSetInput, StudySet, UpdateSetInput } from "@/domain/types";
import type { SetsRepository } from "../repositories/SetsRepository";
import { setFromRow, type SetRow } from "./rows";

export class SupabaseSetsRepository implements SetsRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async listSets(): Promise<StudySet[]> {
    const { data, error } = await this.supabase
      .from("sets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as SetRow[]).map(setFromRow);
  }

  async getSetById(id: string): Promise<StudySet | null> {
    const { data, error } = await this.supabase
      .from("sets")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? setFromRow(data as SetRow) : null;
  }

  async createSet(ownerId: string, input: NewSetInput): Promise<StudySet> {
    const { data, error } = await this.supabase
      .from("sets")
      .insert({ owner_id: ownerId, title: input.title, description: input.description })
      .select()
      .single();

    if (error) throw error;
    return setFromRow(data as SetRow);
  }

  async updateSet(id: string, input: UpdateSetInput): Promise<StudySet> {
    const { data, error } = await this.supabase
      .from("sets")
      .update({ title: input.title, description: input.description })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return setFromRow(data as SetRow);
  }

  async deleteSet(id: string): Promise<void> {
    const { error } = await this.supabase.from("sets").delete().eq("id", id);
    if (error) throw error;
  }
}
