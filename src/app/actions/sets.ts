"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/data/dal";
import { createRepositories } from "@/data/repositories";
import { isSetOwner } from "@/domain/authorization";
import { SetFormSchema } from "./schemas";
import type { FormActionState } from "./types";

export async function createSet(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const user = await requireUser();

  const parsed = SetFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { sets } = await createRepositories();
  const set = await sets.createSet(user.id, parsed.data);

  revalidatePath("/");
  redirect(`/sets/${set.id}`);
}

export async function updateSet(
  setId: string,
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const user = await requireUser();

  const parsed = SetFormSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { sets } = await createRepositories();
  const set = await sets.getSetById(setId);
  if (!set || !isSetOwner(set, user.id)) {
    return { status: "error", message: "You don't have permission to edit this set." };
  }

  await sets.updateSet(setId, parsed.data);

  revalidatePath(`/sets/${setId}`);
  redirect(`/sets/${setId}`);
}

export async function deleteSet(setId: string): Promise<void> {
  const user = await requireUser();

  const { sets } = await createRepositories();
  const set = await sets.getSetById(setId);
  if (!set || !isSetOwner(set, user.id)) {
    throw new Error("You don't have permission to delete this set.");
  }

  await sets.deleteSet(setId);

  revalidatePath("/");
  redirect("/");
}
