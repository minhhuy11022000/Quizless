import { notFound, redirect } from "next/navigation";

import { updateSet } from "@/app/actions/sets";
import { SetForm } from "@/components/sets/SetForm";
import { Card } from "@/components/ui/Card";
import { requireUser } from "@/data/dal";
import { createRepositories } from "@/data/repositories";
import { isSetOwner } from "@/domain/authorization";

export default async function EditSetPage({ params }: PageProps<"/sets/[setId]/edit">) {
  const user = await requireUser();
  const { setId } = await params;

  const { sets } = await createRepositories();
  const set = await sets.getSetById(setId);
  if (!set) {
    notFound();
  }
  if (!isSetOwner(set, user.id)) {
    redirect(`/sets/${setId}`);
  }

  const action = updateSet.bind(null, setId);

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <h1 className="mb-6 text-xl font-semibold">Edit study set</h1>
        <SetForm action={action} defaultValues={set} submitLabel="Save changes" />
      </Card>
    </div>
  );
}
