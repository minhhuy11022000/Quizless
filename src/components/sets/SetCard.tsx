import Link from "next/link";

import type { StudySet } from "@/domain/types";

export function SetCard({ set }: { set: StudySet }) {
  return (
    <Link
      href={`/sets/${set.id}`}
      className="block rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
    >
      <h2 className="font-medium text-zinc-900 dark:text-zinc-50">{set.title}</h2>
      {set.description ? (
        <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {set.description}
        </p>
      ) : null}
    </Link>
  );
}
