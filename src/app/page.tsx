import { requireUser } from "@/data/dal";
import { createRepositories } from "@/data/repositories";
import { SetCard } from "@/components/sets/SetCard";
import { LinkButton } from "@/components/ui/LinkButton";

export default async function DashboardPage() {
  await requireUser();
  const { sets } = await createRepositories();
  const allSets = await sets.listSets();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Study sets</h1>
        <LinkButton href="/sets/new">New set</LinkButton>
      </div>

      {allSets.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No study sets yet. Create the first one to get started.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {allSets.map((set) => (
            <SetCard key={set.id} set={set} />
          ))}
        </div>
      )}
    </div>
  );
}
