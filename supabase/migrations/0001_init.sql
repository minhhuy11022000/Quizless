-- Quizless v1 schema: study sets and cards.
-- Users are Supabase auth users (auth.users) — no separate profiles table
-- is needed yet since v1 doesn't store any profile fields.

create table if not exists public.sets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(trim(title)) > 0),
  description text,
  created_at timestamptz not null default now()
);

create index if not exists sets_owner_id_idx on public.sets (owner_id);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references public.sets (id) on delete cascade,
  term text not null check (char_length(trim(term)) > 0),
  definition text not null check (char_length(trim(definition)) > 0),
  -- Nullable by design: a non-null example makes a card eligible for the
  -- fill-in-the-blank study mode; null means flashcards/test only.
  example text,
  created_at timestamptz not null default now()
);

create index if not exists cards_set_id_idx on public.cards (set_id);

alter table public.sets enable row level security;
alter table public.cards enable row level security;

-- Sets: any authenticated user may read any set (shared viewing); only the
-- owner may create/edit/delete their own sets.
create policy "sets are readable by any authenticated user"
  on public.sets for select
  to authenticated
  using (true);

create policy "sets are insertable by their owner"
  on public.sets for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "sets are updatable by their owner"
  on public.sets for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "sets are deletable by their owner"
  on public.sets for delete
  to authenticated
  using (owner_id = auth.uid());

-- Cards: same ownership rule, checked via the parent set's owner_id.
create policy "cards are readable by any authenticated user"
  on public.cards for select
  to authenticated
  using (true);

create policy "cards are insertable by their set's owner"
  on public.cards for insert
  to authenticated
  with check (
    exists (
      select 1 from public.sets
      where sets.id = cards.set_id and sets.owner_id = auth.uid()
    )
  );

create policy "cards are updatable by their set's owner"
  on public.cards for update
  to authenticated
  using (
    exists (
      select 1 from public.sets
      where sets.id = cards.set_id and sets.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.sets
      where sets.id = cards.set_id and sets.owner_id = auth.uid()
    )
  );

create policy "cards are deletable by their set's owner"
  on public.cards for delete
  to authenticated
  using (
    exists (
      select 1 from public.sets
      where sets.id = cards.set_id and sets.owner_id = auth.uid()
    )
  );
