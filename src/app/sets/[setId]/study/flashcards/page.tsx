import { notFound } from "next/navigation";

import { FlashcardDeck } from "@/components/study/FlashcardDeck";
import { requireUser } from "@/data/dal";
import { createRepositories } from "@/data/repositories";

export default async function FlashcardsPage({
  params,
}: PageProps<"/sets/[setId]/study/flashcards">) {
  await requireUser();
  const { setId } = await params;

  const { sets, cards } = await createRepositories();
  const set = await sets.getSetById(setId);
  if (!set) {
    notFound();
  }

  const setCards = await cards.listCardsBySet(setId);
  if (setCards.length === 0) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{set.title} — Flashcards</h1>
      <FlashcardDeck cards={setCards} setId={setId} />
    </div>
  );
}
