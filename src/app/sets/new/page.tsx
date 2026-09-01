import { createSet } from "@/app/actions/sets";
import { SetForm } from "@/components/sets/SetForm";
import { Card } from "@/components/ui/Card";

export default function NewSetPage() {
  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <h1 className="mb-6 text-xl font-semibold">New study set</h1>
        <SetForm action={createSet} submitLabel="Create set" />
      </Card>
    </div>
  );
}
