# Card-editor architecture refactor — follow-up

Status: prior branches all merged to master. Composables now live under
`src/composables/card-editor/`. The list below is what _remains_; completed
items are kept as strikethroughs for historical context.

---

## Sessions to date

### Session A — single-controller restructure

Split the old `useCardBulkEditor` aggregator into four composables + a
controller that became the single feature root. Single
`provide('card-editor', editor)` from `deck-view.vue`; every consumer does
exactly one `inject<CardListController>('card-editor')!`.

Design rules locked in:

1. Single provide / single inject per feature.
2. Controller owns its queries (callers pass `deck_id` only).
3. Mode lives on the intent layer, not on selection.
4. Intent handlers take explicit args to mutations.
5. Helpers inline if small + single-call-site.
6. Controller return is explicit-pick, not `...spread`.

### Session B — component-owned editor state (PR #143)

Killed the optimistic-rollback machinery in the mutation layer in favour of
local component state in `list-item-card.vue`. `saveCard` (db) is pure;
`useSaveCardMutation` no longer invalidates the deck on settle; save
failures surface via a new `error` prop on `Card`. Architecture rule added:
`src/api/` functions must not mutate their args.

### Session C — temp-card lifecycle, decoupling, and convention pass

Shipped on `refactor/card-editor-composables` (merged to master).

**Temp-card lifecycle (Item #2 from old list — option (b) chosen):**

- Every rendered card carries a stable `client_id` (uid()-based) used as the
  v-for key; `Card & { client_id: string }` wrapper exposed by
  `all_cards.value`.
- `promoteTemp(temp_id, real_id, rank, values)` seeds a per-deck Map
  `client_id_by_real_id` so the persisted refetch reuses the temp's
  client_id — text editor stays mounted across the temp → persisted
  handoff. No more `local_keys` Map, no more `id < 0` / `id > 0` sentinels,
  no more brittle key migration.
- `live_temps` filters out promoted entries whose persisted refetch has
  arrived (`persisted_id_set.has(entry.real_id)`). Dedupe is now explicit.
- Dev-only invariant `assertUniqueClientIds(cards)` runs inside `all_cards`
  to catch dedupe regressions loudly.
- `findEntryByCardId(id)` replaces `findTemp` and the sign-of-id sniffing.
  Used by `updateCard` to branch INSERT vs UPDATE on
  `entry.real_id === null`.

**Layering / decoupling:**

- `useCardMutations` is now a thin wrapper layer over `@/api/cards` hooks
  (`insertCard`, `saveCard`, `deleteCards`, `moveCards`). Zero knowledge of
  list state. Controller owns the temp-routing in `updateCard` and the
  `saving` flag.
- `useCardSelection(deck_id)` self-owns its query, reading
  `total_card_count` from `useDeckQuery.card_count`. Dropped the dead
  `useDeckCardIdsQuery` + `fetchCardIdsByDeckId` db helper.
- `useCardListController({ deck_id })` self-owns its `useDeckQuery`
  (Pinia Colada dedupe means `deck-view`'s own call shares the cache).
  Controller `Options` no longer takes `deck_query`.
- Composables and tests regrouped under `src/composables/card-editor/` and
  `tests/unit/composables/card-editor/`.

**Single-responsibility / nesting pass on the controller:**

- `withSaving<T>(fn)` — generic try/finally wrapper around the saving flag.
- `insertTemp(temp_id, entry, values)` — INSERT + promote, no flag logic.
- `confirmDelete(count)` — opens the alert, returns the response promise
  (no double-await).
- `afterDelete()` — selection clear + refetch + setMode('view') trio.
- `resolveDeleteArgs(additional_card_id)` — pure: deduces
  `{ count, args }` or `null` from selection state.
- `openMoveModal(cards)` — sfx + modal open + settle sfx, returns response.
- `updateCard`, `onDeleteCards`, `onMoveCards` are now flat orchestrators
  with early returns.

**Single-responsibility pass on `virtual-card-list`:**

- `wrapPersisted()`, `withTempInserted(cards, entry)`,
  `assertUniqueClientIds(cards)` — `all_cards` computed reads as
  `live_temps.value.reduce(withTempInserted, wrapPersisted())`.
- `resolveAnchor(left, right)` and `buildEmptyCard()` extracted from
  `addCard`.

**Rules added:**

- `.claude/rules/composables.md` — JSDoc on every exported function in
  `src/composables/`; lead with behaviour; document edge cases; skip
  restating the type.
- `.claude/rules/code-style.md` — blank-line grouping inside function
  bodies; max one level of nesting (use early returns and inverted ifs);
  one responsibility per function (orchestrator vs worker).

**Tooling:**

- Skill `prepare-prs` renamed to `prepare-pr`. New `--split` flag (default =
  single PR; bundles uncommitted work into the PR).

**Test count:** 1132 passing. vue-tsc: 0 errors. Format: clean.

---

## What remains — the follow-up refactor

Ordered by impact ÷ effort. Pick up from the top in a fresh session.

### 1. [DONE] ~~Optimistic rollback on updateCard~~

Shipped Session B. See above.

### 2. [DONE] ~~Temp-card lifecycle refactor~~

Shipped Session C. Option (b) — client-side `client_id` instead of relying
on id sign — chosen and implemented. The dev invariant assertion landed
alongside.

### 3. [MED] select-all completeness constraint

`src/composables/card-editor/card-list-controller.ts` — `onDeleteCards`
select-all path correctly routes through `deleteCards({ except_ids })`
which handles the whole-deck delete server-side. That path is safe.

But `loadedSelectedCards()` (and anything that calls
`selection.filterSelected(list.persisted_cards.value)`) returns only loaded
cards in select-all mode. If any flow builds a write payload from the
loaded set while `select_all_mode && hasNextPage`, it silently truncates.

Today: UI disables the Move toolbar button in select-all mode (soft guard).

**Hard guard**: in `loadedSelectedCards` (or a higher-level check):

```ts
function loadedSelectedCards(): Card[] {
  if (selection.select_all_mode.value && cards_query.hasNextPage.value) {
    throw new Error(
      'Cannot build a loaded-cards payload while select_all_mode is active ' +
        'with unloaded pages. Use deleteCards({ except_ids }) or load all pages first.'
    )
  }
  return ...
}
```

Or: make `onMoveCards` load all pages before building the payload when
`select_all_mode` is true (async iteration of `cards_query.loadNextPage`
until `!hasNextPage`).

Bulk move via toolbar is currently a dead path (`onMoveCards` called with
undefined id short-circuits via `cards.length === 0`). If bulk move is ever
wanted, it must handle this.

### 4. [MED] Image mutations bypass the orchestration layer

`src/views/deck/card-editor/list-item-card.vue:5,29,30,49,60`:

```ts
import { useSetCardImageMutation, useDeleteCardImageMutation } from '@/api/cards'
const set_image_mutation = useSetCardImageMutation()
const delete_image_mutation = useDeleteCardImageMutation()
```

Direct imports in a leaf component. Every other card write goes through
`useCardMutations` → exposed via controller. Image writes:

- Are not debounced / deduped if user toggles rapidly
- Don't use the `saving` flag (UI has no "saving image" indicator)
- Don't live in the mutation layer's test surface
- Continue firing if the component unmounts mid-upload

**Fix**: add to `useCardMutations`:

```ts
const set_image_mutation = useSetCardImageMutation()
const delete_image_mutation = useDeleteCardImageMutation()

async function setCardImage(card_id: number, side: 'front' | 'back', file: File) {
  if (deck_id.value === undefined) return
  try {
    await set_image_mutation.mutateAsync({ card_id, deck_id: deck_id.value, file, side })
  } catch (e) {
    // surface via toast? or return Result-style error
  }
}

async function deleteCardImage(card_id: number, side: 'front' | 'back') { ... }
```

Expose `setCardImage` / `deleteCardImage` on the controller. `list-item-card`
calls those instead of importing mutations directly.

Tests: `list-item-card.test.js` already mocks `@/api/cards`; migrate to stub
`editor.setCardImage` / `editor.deleteCardImage` and assert on those calls.

Note: the controller now owns `updateCard` directly (Session C); pattern to
mirror is `withSaving(() => mutations.setCardImage(...))`.

### 5. [LOW] Convention polish (bundle)

Small fixes worth doing together in one commit:

- `src/views/deck/card-editor/list-item-card.vue:76–82` — replace
  `setTimeout(resolve, FOCUS_DELAY)` with a focus-out event listener or a
  transition event. Per `.claude/rules/animations.md` (no magic timeouts).
- Extract `FOCUS_DELAY = 1` constant — if it stays, move to a shared
  constants file so any change is single-source.
- ~~Add invariant assertion in `virtual-card-list.ts` `all_cards` computed
  (see #2 quick win).~~ Shipped Session C as `assertUniqueClientIds`.
- `src/views/deck/card-editor/list-item.vue:10–14` + `list-item-card.vue:14–17`
  — extract named `type ListItemProps = {...}` + `type ListItemCardProps = {...}`
  per `.claude/rules/vue-props.md`.
- ~~Add a doc comment block in `virtual-card-list.ts` explaining the temp →
  real id promotion contract (helps anyone reading #2 cold).~~ Landed
  Session C as JSDoc on `useVirtualCardList` + `promoteTemp`.

---

## New smells observed during the refactor (not in the original audit)

| #   | Smell                                                                                             | Note                                                                                                                                                                              |
| --- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A   | Controller couples UI primitives (`useModal`, `useAlert`, `useI18n`, `emitSfx`, `MoveCardsModal`) | Deliberate. Factoring them out as callbacks was considered and rejected for one-call-site boilerplate. Revisit if the controller needs to run headless (e.g. a bulk-import tool). |
| B   | `addCard()` with no args lands mid-deck when `hasNextPage` is true                                | Documented inline in `virtual-card-list.ts:addCard`. Proper fix: gate the global "+ card" affordance on `!hasNextPage`, or make `addCard` load all pages first.                   |
| C   | `saving` flag is global, not per-card                                                             | User editing two cards quickly can't tell which is in-flight. If relevant UX, add `saving_card_ids: Ref<Set<number>>` to the controller.                                          |

---

## Controller public surface (current)

For reference when wiring tests / new consumers:

```ts
{
  // list — rendered cards + add/append/prepend
  all_cards, addCard, appendCard, prependCard,

  // selection — predicates, actions, derived counts
  isCardSelected, selectCard, deselectCard, toggleSelectCard,
  selectAllCards, clearSelectedCards, toggleSelectAll,
  selected_card_ids, deselected_ids, select_all_mode,
  selected_count, all_cards_selected, total_card_count,

  // writes — in-flight flag + edit entry-point
  saving, updateCard,

  // deck-derived
  card_attributes, deck_id,

  // UI state
  mode, setMode,

  // infinite scroll
  hasNextPage, isLoading, observeSentinel,

  // intent handlers — what templates call on user actions
  onCancel, onDeleteCards, onSelectCard, onMoveCards,
}
```

Notes:

- `getKey` is gone. v-for keys come straight from `card.client_id` on each
  item in `all_cards`.
- `all_cards` items are typed `CardWithClientId = Card & { client_id: string }`.
- Internal seams (`findEntryByCardId`, `findCard`, `promoteTemp`,
  `temp_entries`, `persisted_cards`, `filterSelected`, `deleteCards`,
  `moveCards`, `insertCard`, `saveCard`) do not leak to the consumer
  surface.

---

## Gotchas for the next session

- Composables now live under `src/composables/card-editor/`. Imports use
  `@/composables/card-editor/<name>`. Old top-level paths are gone.
- `vp fmt` / `vp check --fix` will reformat unrelated markdown across
  `.claude/rules/`, `.claude/skills/`, `CLAUDE.md`. Run
  `git restore --source=master --` on those before committing. Same applies
  to any file you haven't intentionally touched.
- Baseline test count going into the next session should be **1132**. If it
  differs, something regressed before you started.
- `vp dlx vue-tsc --noEmit -p tsconfig.app.json` is the typecheck invocation
  (`vp check` does not run tsc).
- Pinia Colada mutation signature differs slightly from TanStack — check
  `src/api/cards/mutations/save.ts` for the current `onSettled` shape before
  adding `onMutate`.
- Two project rules now in force on any composables work:
  `.claude/rules/composables.md` (JSDoc), `.claude/rules/code-style.md`
  (blank-line grouping, max one level of nesting, single responsibility).
