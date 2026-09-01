import type { Card, NewCardInput, UpdateCardInput } from "@/domain/types";

/** Storage-agnostic contract for card persistence. See SetsRepository. */
export interface CardsRepository {
  listCardsBySet(setId: string): Promise<Card[]>;
  getCardById(id: string): Promise<Card | null>;
  createCard(input: NewCardInput): Promise<Card>;
  updateCard(id: string, input: UpdateCardInput): Promise<Card>;
  deleteCard(id: string): Promise<void>;
}
