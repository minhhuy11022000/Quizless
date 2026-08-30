# Quizless — Design Spec

Date: 2026-08-30

## Concept

A Quizlet-like study app for a small group of friends, with one core
differentiator from Quizlet: each card can carry an **example sentence**
as a distinct field alongside term/definition, and that example powers a
dedicated **fill-in-the-blank** study mode — not just shown as passive
context.

## Motivation

Not a clone for its own sake — a niche product built around a specific
gap: Quizlet's cards are flat term/definition pairs. This app treats the
example sentence as first-class, optional, per-card content that unlocks
its own way of testing recall (recalling the word in context, not just
matching it to a definition).

## Audience & scale (v1)

Small group of friends. Real accounts (not the trusted-no-auth pattern
used in other small projects), but no public signup flow, no
monetization, no scaling concerns yet. Responsive web app, not native
mobile — revisit native only if usage grows enough that "add to home
screen" stops being sufficient.

## Architecture

- **Next.js (App Router)**, deployed on Vercel.
- **Supabase** for Postgres + auth (magic-link or OAuth login — real
  per-person accounts).
- Server Components / Server Actions handle data reads/writes and auth
  callbacks. No separate backend service.

Next.js was chosen over a plain Vite+React SPA (the pattern used in a
sibling project) because: (1) real auth needs server-side callback/session
handling, which Next.js provides in-project via API routes/Server Actions
rather than requiring a bolted-on server; (2) server-side data fetching
avoids blank-page-then-fetch on every page as content grows; (3) it's
Vercel's first-class framework for deploys/previews.

## Data model

- **users** — from Supabase auth, one row per person.
- **sets** — a study set.
  - `id`, `owner_id`, `title`, `description`, `created_at`
- **cards** — belongs to a set.
  - `id`, `set_id`, `term`, `definition`, `example` (nullable text)

The `example` column being nullable is the mechanism for "optional per
card, author's choice" — no separate table needed. A card with a non-null
`example` becomes eligible for fill-in-the-blank; a card with a null
`example` is flashcards/multiple-choice only.

## Permissions

Row-level ownership: a set's `owner_id` is the only user who can
create/edit/delete its cards. Any authenticated user can view and study
any set (read-only) — owner-only editing, shared viewing.

## Study modes (v1)

1. **Flashcards** — flip between term and definition. If the card has an
   example, it's shown too, as context (not being tested here).
2. **Multiple-choice test** — term shown, 4 definitions as options (1
   correct + 3 distractors drawn from other cards in the same set).
   Examples are not shown in this mode — it tests definition recall only.
3. **Fill-in-the-blank** — standalone mode, scoped to only the cards in
   the set that have a non-null `example`. Shows the example sentence
   with the term masked: match the term as a whole word (word-boundary
   match, case-insensitive — so "cat" matches "Cat" but not "catalog"),
   masking the first occurrence. If the term doesn't appear in the
   example as a whole word (e.g. the example uses a different inflection,
   like "ran" for term "run"), the card is skipped in this mode rather
   than shown unmasked or mismatched. User types the answer; matching is
   exact, case-insensitive (no fuzzy/typo tolerance in v1). A set with no
   eligible cards simply doesn't offer this mode.

## Testing

Mirrors the sibling bet-tracker project's approach: isolate pure logic
into testable utilities, verify UI manually in the browser.

Unit-test candidates (pure functions, clear inputs/outputs):
- Term-masking function (given an example sentence + term, produce the
  blanked sentence).
- Fill-in-the-blank answer checker (exact match, case-insensitive).
- Multiple-choice distractor selection (given a set's cards and a target
  card, pick 3 distractor definitions).

## Out of scope for v1

- Spaced repetition / adaptive "Learn" mode
- Multiplayer / Live mode
- Sharing sets outside the group
- Native mobile app
- Fuzzy/typo-tolerant answer matching
