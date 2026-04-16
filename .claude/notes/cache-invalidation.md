# Cache invalidation migration — notes for later

Archived from a design conversation. Pick this up _after_ the BE cleanup work
(kill `reserveCard`, move `fetchDeck` to a view, `setCardImage` dedupe trigger)
has landed, since those changes simplify the migration surface.

---

## The problem this solves

UI values drift out of sync with the backend. Most pressing: deck `due_count`.
Also `card_count`, and anything derived-per-deck you add later.

Root cause: **there's no invalidation layer**. The dashboard fetches decks once
on mount; mutations that happen elsewhere in the tree don't signal back. Known
drift points today:

- Study session → dashboard: `useStudyModal().start()` is fire-and-forget; the
  dashboard never learns a review was saved.
- Deck-view mutations → dashboard: deck-view correctly calls `refetchDeck()`,
  but the dashboard's `decks` ref isn't touched.
- Any card edit that shifts a due date: no refetch anywhere.

## The decision

Adopt **TanStack Query (Vue Query)** as the single paradigm for server-state
interactions. NOT Pinia-for-decks.

**Why not a Pinia store for decks:** decks are _server state_ (fetched, cached,
potentially stale). Pinia is well-suited to _client state_ (session, theme,
modal stacks, shortcut registry). Putting server state in Pinia means manually
re-implementing invalidation, refetch-on-focus, deduping, loading/error — which
is just a worse query cache.

**Clean split to aim for:**

- Pinia → client state (session, member, theme, shortcuts, ephemeral UI)
- Query cache → server state (decks, cards, reviews, media)

## Scope

- 35 exported API functions in `src/api/`
- ~45 call sites across 18 files (5 composables, 7 views, 4 components, 2 stores)
- ~150 lines of existing cache-adjacent logic (manual refetches, debounces,
  optimistic inserts)
- Estimate: one focused 2-week refactor, or ~4 weeks at 50% with normal feature
  work interleaved

## Suggested migration order (bottom-up by layer)

1. **Set up Vue Query + design query-key convention** upfront
   (`['decks']`, `['deck', id]`, `['cards', deckId]`, etc.) — ~1 day
2. **Deck reads + mutations** — this alone fixes the original drift problem,
   so it validates the pattern end-to-end. ~2 days
3. **Members + shop** — small, self-contained. ~1 day
4. **Card CRUD** — biggest call-site density. ~3 days
5. **Images** — ~2 days
6. **Hot paths last** (study session `saveReview`, bulk editor `saveCard`) —
   needs behavioral validation. ~4 days
7. **Auth** — can likely stay in Pinia since it's identity, not fetched data

Each layer can ship independently. Step 2 is the one that fixes the drift.

## Enforcement while migrating (avoid paradigm-mixing)

Add a CI check from day one: grep for `@/api` imports outside approved query
and mutation wrappers, and direct `supabase.` usage outside `src/api/`.
Prevents drift toward a two-paradigm app during the multi-week window.

## Sharp edges to plan for

- **`saveCard` debounces inside the API layer** (`src/api/cards/update.ts`).
  TanStack expects caller-side debouncing. Pull the debounce out of the API
  and into the mutation wrapper.
- **`saveReview` is fire-and-forget** during study sessions. `mutate()`
  supports this natively but wire up real `onError` handling — today errors
  are just logged and the session advances anyway.
- **`reserveCard` as Q/M hybrid** — not a concern, it's being killed during
  the pre-migration cleanup.
- **`fetchDeck` coarse invalidation** — by the time this migration starts,
  `fetchDeck` will be reading from the `decks_with_stats` view. Still worth
  deciding whether to split query keys: `['deck', id]` vs `['cards', deckId]`
  - `['reviews', cardId]`. Splitting lets card-level mutations invalidate
    without refetching the whole deck aggregate.

## Open decisions for when you pick this up

- Keep auth in Pinia, or migrate it too? (Recommendation: keep it in Pinia.)
- Granularity of query keys for cards/reviews inside a deck — single monolith
  key vs split. Split is more work but aligns with mutation granularity.
- Persistence layer for the cache? (localStorage for stale-while-revalidate on
  reload.) Nice-to-have, not required for v1.
