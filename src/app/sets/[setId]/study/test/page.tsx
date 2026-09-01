import { notFound } from "next/navigation";

import { MultipleChoiceQuiz } from "@/components/study/MultipleChoiceQuiz";
import { requireUser } from "@/data/dal";
import { createRepositories } from "@/data/repositories";

export default async function TestPage({ params }: PageProps<"/sets/[setId]/study/test">) {
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
      <h1 className="text-2xl font-semibold">{set.title} — Test</h1>
      <MultipleChoiceQuiz cards={setCards} setId={setId} />
    </div>
  );
}
