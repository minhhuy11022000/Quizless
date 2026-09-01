import { notFound } from "next/navigation";

import { requireUser } from "@/data/dal";
import { createRepositories } from "@/data/repositories";
import { isSetOwner } from "@/domain/authorization";
import { selectFillBlankCards } from "@/domain/study/selectFillBlankCards";
import { CardForm } from "@/components/cards/CardForm";
import { CardListItem } from "@/components/cards/CardListItem";
import { DeleteSetButton } from "@/components/sets/DeleteSetButton";
import { LinkButton } from "@/components/ui/LinkButton";

export default async function SetPage({ params }: PageProps<"/sets/[setId]">) {
  const user = await requireUser();
  const { setId } = await params;

  const { sets, cards } = await createRepositories();
  const set = await sets.getSetById(setId);
  if (!set) {
    notFound();
  }

  const setCards = await cards.listCardsBySet(setId);
  const owner = isSetOwner(set, user.id);
  const fillBlankCount = selectFillBlankCards(setCards).length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{set.title}</h1>
          {set.description ? (
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">{set.description}</p>
          ) : null}
        </div>
        {owner ? (
          <div className="flex shrink-0 gap-2">
            <LinkButton href={`/sets/${set.id}/edit`} variant="secondary">
              Edit
            </LinkButton>
            <DeleteSetButton setId={set.id} />
          </div>
        ) : null}
      </div>

      {setCards.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          <LinkButton href={`/sets/${set.id}/study/flashcards`} variant="secondary">
            Flashcards
          </LinkButton>
          <LinkButton href={`/sets/${set.id}/study/test`} variant="secondary">
            Multiple-choice test
          </LinkButton>
          {fillBlankCount > 0 ? (
            <LinkButton href={`/sets/${set.id}/study/fill-blank`} variant="secondary">
              Fill in the blank
            </LinkButton>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-3">
        <h2 className="text-lg font-medium">Cards ({setCards.length})</h2>
        {setCards.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">No cards yet.</p>
        ) : (
          <ul className="space-y-3">
            {setCards.map((card) => (
              <li key={card.id}>
                <CardListItem card={card} editable={owner} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {owner ? (
        <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <h2 className="mb-3 text-lg font-medium">Add a card</h2>
          <CardForm setId={set.id} />
        </div>
      ) : null}
    </div>
  );
}
