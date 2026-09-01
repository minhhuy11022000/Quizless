import { LoginForm } from "@/components/auth/LoginForm";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm">
      <Card>
        <h1 className="mb-1 text-xl font-semibold">Sign in</h1>
        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          We&apos;ll email you a magic link — no password needed.
        </p>
        <LoginForm />
      </Card>
    </div>
  );
}
