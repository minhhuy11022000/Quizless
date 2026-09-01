import { notFound } from "next/navigation";

import { FillBlankQuiz } from "@/components/study/FillBlankQuiz";
import { requireUser } from "@/data/dal";
import { createRepositories } from "@/data/repositories";
import { selectFillBlankCards } from "@/domain/study/selectFillBlankCards";

export default async function FillBlankPage({
  params,
}: PageProps<"/sets/[setId]/study/fill-blank">) {
  await requireUser();
  const { setId } = await params;

  const { sets, cards } = await createRepositories();
  const set = await sets.getSetById(setId);
  if (!set) {
    notFound();
  }

  const setCards = await cards.listCardsBySet(setId);
  if (selectFillBlankCards(setCards).length === 0) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{set.title} — Fill in the blank</h1>
      <FillBlankQuiz cards={setCards} setId={setId} />
    </div>
  );
}
