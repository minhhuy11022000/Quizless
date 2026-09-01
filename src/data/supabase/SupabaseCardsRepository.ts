import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Card, NewCardInput, UpdateCardInput } from "@/domain/types";
import type { CardsRepository } from "../repositories/CardsRepository";
import { cardFromRow, type CardRow } from "./rows";

export class SupabaseCardsRepository implements CardsRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async listCardsBySet(setId: string): Promise<Card[]> {
    const { data, error } = await this.supabase
      .from("cards")
      .select("*")
      .eq("set_id", setId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data as CardRow[]).map(cardFromRow);
  }

  async getCardById(id: string): Promise<Card | null> {
    const { data, error } = await this.supabase
      .from("cards")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? cardFromRow(data as CardRow) : null;
  }

  async createCard(input: NewCardInput): Promise<Card> {
    const { data, error } = await this.supabase
      .from("cards")
      .insert({
        set_id: input.setId,
        term: input.term,
        definition: input.definition,
        example: input.example,
      })
      .select()
      .single();

    if (error) throw error;
    return cardFromRow(data as CardRow);
  }

  async updateCard(id: string, input: UpdateCardInput): Promise<Card> {
    const { data, error } = await this.supabase
      .from("cards")
      .update({ term: input.term, definition: input.definition, example: input.example })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return cardFromRow(data as CardRow);
  }

  async deleteCard(id: string): Promise<void> {
    const { error } = await this.supabase.from("cards").delete().eq("id", id);
    if (error) throw error;
  }
}
