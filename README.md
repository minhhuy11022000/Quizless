# Quizless

A Quizlet-like study app for a small group of friends. Its differentiator:
each card can carry an optional **example sentence**, which powers a
dedicated **fill-in-the-blank** study mode (not just passive context).

See [`docs/superpowers/specs/2026-08-30-quizless-design.md`](docs/superpowers/specs/2026-08-30-quizless-design.md)
for the full design spec.

## Stack

- **Next.js 16** (App Router, Server Components/Actions) on **Vercel**.
- **Supabase** for Postgres + auth (magic link).
- **Vitest** for unit-testing the pure domain logic.

## Project structure

```
src/
  domain/       Framework-agnostic business logic (masking, answer checking,
                distractor selection, authorization). No Next.js/Supabase
                imports — this is what's unit-tested.
  data/         Data access: repository interfaces + Supabase implementations,
                and the auth Data Access Layer (src/data/dal.ts).
  lib/supabase/ Supabase client factories (server/browser) and the session
                refresh helper used by proxy.ts.
  components/   UI, split into ui/ (generic primitives), and feature folders
                (auth/, sets/, cards/, study/).
  app/          Routes, plus app/actions/ for Server Actions (the only code
                that wires domain + data together with auth checks).
supabase/migrations/  SQL schema + Row Level Security policies.
```

Data flows one way: **pages/actions → data layer (repository interfaces) →
Supabase**, with authorization enforced both in the Server Action (explicit
ownership checks) and in Postgres (RLS), and pure `domain/` functions used
by both server and client code with no framework dependency.

## Setup

1. Install dependencies:

   ```bash
   bun install
   ```

2. Create a Supabase project (or use an existing one), then run the schema
   migration in `supabase/migrations/0001_init.sql` against it — either
   paste it into the Supabase SQL editor, or via the CLI if your project is
   linked:

   ```bash
   bunx supabase db push
   ```

3. Copy the env template and fill in your project's URL/anon key (Supabase
   dashboard → Settings → API):

   ```bash
   cp .env.example .env.local
   ```

4. In Supabase Auth settings, make sure email (magic link) sign-in is
   enabled, and add `http://localhost:3000/auth/callback` (and your prod
   URL's equivalent) to the redirect URL allow list.

5. Run the dev server:

   ```bash
   bun dev
   ```

## Scripts

- `bun dev` — start the dev server.
- `bun run build` — production build.
- `bun run test` — run unit tests once.
- `bun run test:watch` — run unit tests in watch mode.
- `bun run lint` — lint.

## Testing approach

Pure logic (term masking, answer checking, distractor selection) lives in
`src/domain` and is unit-tested there. UI is verified manually in the
browser — see `docs/superpowers/specs/2026-08-30-quizless-design.md` for
the reasoning.
