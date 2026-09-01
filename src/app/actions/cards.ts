"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/data/dal";
import { createRepositories } from "@/data/repositories";
import { isSetOwner } from "@/domain/authorization";
import { CardFormSchema } from "./schemas";
import type { FormActionState } from "./types";

export async function createCard(
  setId: string,
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const user = await requireUser();

  const parsed = CardFormSchema.safeParse({
    term: formData.get("term"),
    definition: formData.get("definition"),
    example: formData.get("example"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { sets, cards } = await createRepositories();
  const set = await sets.getSetById(setId);
  if (!set || !isSetOwner(set, user.id)) {
    return { status: "error", message: "You don't have permission to add cards to this set." };
  }

  await cards.createCard({ setId, ...parsed.data });

  revalidatePath(`/sets/${setId}`);
  return { status: "idle" };
}

export async function updateCard(
  cardId: string,
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const user = await requireUser();

  const parsed = CardFormSchema.safeParse({
    term: formData.get("term"),
    definition: formData.get("definition"),
    example: formData.get("example"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { sets, cards } = await createRepositories();
  const card = await cards.getCardById(cardId);
  if (!card) {
    return { status: "error", message: "Card not found." };
  }

  const set = await sets.getSetById(card.setId);
  if (!set || !isSetOwner(set, user.id)) {
    return { status: "error", message: "You don't have permission to edit this card." };
  }

  await cards.updateCard(cardId, parsed.data);

  revalidatePath(`/sets/${card.setId}`);
  return { status: "idle" };
}

export async function deleteCard(cardId: string): Promise<void> {
  const user = await requireUser();

  const { sets, cards } = await createRepositories();
  const card = await cards.getCardById(cardId);
  if (!card) {
    return;
  }

  const set = await sets.getSetById(card.setId);
  if (!set || !isSetOwner(set, user.id)) {
    throw new Error("You don't have permission to delete this card.");
  }

  await cards.deleteCard(cardId);
  revalidatePath(`/sets/${card.setId}`);
}
