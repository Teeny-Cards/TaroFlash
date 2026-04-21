# Card-editor architecture refactor — follow-up

Branch: `refactor/card-list-controller` (PR not yet opened).

Context: audit of `src/views/deck/card-editor/` identified 6 findings. This
session completed the architectural restructure (original Rec 5, expanded).
Findings 1, 2, 3, 4, 6, 7 from the original audit remain open, plus a few new
smells surfaced during the refactor.

---

## What this session shipped

Split the old `useCardBulkEditor` aggregator into four composables + a
controller that is the single feature root:

```
deck-view.vue
  deck_query = useDeckQuery(...)
  editor = useCardListController({ deck_id, deck_query })
      ├── cards_query        (internal, owned by controller)
      ├── ids_query          (internal, owned by controller)
      ├── card_attributes    (computed from deck_query.data)
      ├── list       = useVirtualCardList(cards_query, deck_id)
      ├── selection  = useCardSelection(ids_query)
      ├── mutations  = useCardMutations({ list, deck_id })
      ├── mode + setMode
      ├── hasNextPage / isLoading / observeSentinel(ref)
      └── onCancel / onDeleteCards / onSelectCard / onMoveCards

  provide('card-editor', editor)  // SINGLE provide
```

Every consumer (`card-editor/index.vue`, `list.vue`, `list-item.vue`,
`list-item-card.vue`, `card-grid/index.vue`, `card-grid/grid-item.vue`,
`bulk-select-toolbar.vue`, `card-importer.vue`) does exactly one inject:
`inject<CardListController>('card-editor')!`.

### Design rules the refactor locked in

1. **Single provide / single inject per feature.** `'card-editor'` is the only
   key. No parallel `'cards-query'` / `'card-attributes'` / `'on-*-card'`
   provides.
2. **Controller owns its queries.** Callers pass `deck_id + deck_query` only.
   `cards_query` and `ids_query` are constructed inside the controller.
3. **Mode lives on the intent layer**, not on selection. Selection is pure
   data (ids + counts); mode is UI state driven by intent handlers.
4. **Intent handlers take explicit args** to mutations. No more
   `selection.selectCard(id)` → `getSelectedCards()` dance as a side-effect to
   piggy-back the bulk flow. `deleteCards({ cards } | { except_ids })`,
   `moveCards({ cards, target_deck_id })`.
5. **Helpers inline if small + single-call-site.** `loadedSelectedCards` and
   `collectCards` live inside `useCardListController`, not in `src/utils/`.
   Extract only when reused.
6. **Controller return is explicit-pick, not `...spread`.** Internal seams
   (`findTemp`, `findCard`, `promoteTemp`, `temp_cards`, `persisted_cards`,
   `filterSelected`, `deleteCards`, `moveCards`, `getSelectedCards`) do not
   leak to the consumer surface.

### Files touched

New:

- `src/composables/card-list-controller.ts`
- `src/composables/card-mutations.ts`
- `src/composables/card-selection.ts`
- `src/composables/virtual-card-list.ts`
- `tests/unit/composables/card-list-controller.test.js`

Deleted:

- `src/composables/card-bulk-editor.ts`
- `tests/unit/composables/card-bulk-editor.test.js`

Modified (inject shape + type imports):

- `src/components/card/{index,card-face}.vue` — import `CardEditorMode` from
  `card-list-controller` instead of removed `card-bulk-editor`
- `src/views/deck/deck-view.vue` — single provide, drops inline handlers +
  modal/alert/sfx/move-mutation imports
- `src/views/deck/bulk-select-toolbar.vue`
- `src/views/deck/card-editor/{index,list,list-item,list-item-card}.vue`
- `src/views/deck/card-grid/{index,grid-item}.vue`
- `src/views/deck/card-importer.vue` — injects controller for `deck_id`
- Integration tests for the above

Baseline going in: 1061 tests passing. After refactor: 1067 tests passing.
vue-tsc: 0 errors. Format: clean.

---

## What remains — the follow-up refactor

Ordered by impact ÷ effort. Pick up from the top in a fresh session.

### 1. [HIGH] Optimistic rollback on updateCard

`src/composables/card-mutations.ts` — `updateCard` path for real cards:

```ts
saving.value = true
try {
  await save_mutation.mutateAsync({ card, values })
} finally {
  saving.value = false
}
```

The save mutation internally mutates `card` in place before the network call.
If the network call fails, the local card object is already mutated — UI
shows the new value but the DB has the old one, and a future refetch will
silently revert the user's edit.

If the user edits the same card twice quickly while the first save is
in-flight, the second `save_mutation.mutateAsync` runs against the already-
mutated card. The first mutation's `onSettled` invalidates the cache, which
may refetch the pre-edit-2 state and clobber edit-2 on the next render.

**Fix**: add `onMutate` / `onError` around `save_mutation`:

```ts
return useMutation({
  mutation: ({ card, values }) => saveCard(card, values),
  onMutate: ({ card, values }) => {
    const rollback = { ...card } // snapshot
    Object.assign(card, values) // optimistic apply
    return rollback
  },
  onError: (_err, { card }, rollback) => {
    if (rollback) Object.assign(card, rollback)
  },
  onSettled: (_data, _err, _vars, _ctx, { queryCache }) => {
    invalidateDeck(queryCache, deck_id)
  }
})
```

Likely lives inside `src/api/cards/mutations/save.ts`, not in the composable
layer. Verify the Pinia Colada mutation signature for context parameter shape.

Tests: add cases for "updateCard rolls back local card on network failure",
"concurrent edits don't drop the later value".

---

### 2. [HIGH] Temp-card lifecycle refactor

`src/composables/virtual-card-list.ts` coordinates three parallel systems:

- `temp_cards: Ref<TempCardEntry[]>` — in-memory staged cards
- `local_keys: Map<number, string>` — stable v-for keys (not reactive)
- `promoted_temp_ids: ComputedRef<Set<number>>` — dedupe of persisted vs temp

On promotion (temp → real after insert succeeds):

1. `local_keys.delete(old_id); local_keys.set(new_id, old_key)` — key migration
2. `temp.card.id = new_id; temp.card.rank = new_rank` — identity mutation
3. `Object.assign(temp.card, values)` — text apply
4. Temp stays in the list after promotion; `promoted_temp_ids` dedupes the
   refetched persisted copy so rendering doesn't churn.

Risks:

- If the key migration is forgotten or ordered wrong, the text-editor
  component remounts and loses focus mid-typing.
- If the temp is removed before the persisted refetch arrives, the card
  disappears briefly, then reappears — visible flicker.
- The dedupe logic assumes `temp.card.id > 0` means "already promoted".
  Brittle sentinel — bugs here are silent edit loss.

**Shape options**:

(a) Extract `useTempCards()` composable with an explicit `promoteTemp`
returning the migrated entry. Narrow surface, single responsibility for
lifecycle.

(b) Rethink the "temp stays in list after promotion" pattern. Alternative:
track temp cards by an internal UUID independent of Postgres id.
`getKey(card)` looks up UUID → v-for key. ID mutation no longer affects
key. Simpler invariant: temp in list iff UUID not yet in persisted data.

Option (b) is cleaner but needs a server-returned UUID or a client-generated
one threaded through the insert RPC. Check `src/api/cards/db/insert.ts` +
Supabase `insert_card_at` RPC — would need server side to echo a
client-provided UUID.

**Quick win regardless**: add an invariant assertion inside the `all_cards`
computed that no id appears twice in the merged output. Fires loudly when
the dedupe breaks.

---

### 3. [MED] select-all completeness constraint

`src/composables/card-list-controller.ts` — `onDeleteCards` select-all path
correctly routes through `deleteCards({ except_ids })` which handles the
whole-deck delete server-side. That path is safe.

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

---

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

---

### 5. [LOW] Convention polish (bundle)

Small fixes worth doing together in one commit:

- `src/views/deck/card-editor/list-item-card.vue:76–82` — replace
  `setTimeout(resolve, FOCUS_DELAY)` with a focus-out event listener or a
  transition event. Per `.claude/rules/animations.md` (no magic timeouts).
- Extract `FOCUS_DELAY = 1` constant — if it stays, move to a shared
  constants file so any change is single-source.
- Add invariant assertion in `virtual-card-list.ts` `all_cards` computed
  (see #2 quick win).
- `src/views/deck/card-editor/list-item.vue:10–14` + `list-item-card.vue:14–17`
  — extract named `type ListItemProps = {...}` + `type ListItemCardProps = {...}`
  per `.claude/rules/vue-props.md`.
- Add a doc comment block in `virtual-card-list.ts` explaining the temp →
  real id promotion contract (helps anyone reading #2 cold).

---

## New smells observed during the refactor (not in the original audit)

| #   | Smell                                                                                             | Note                                                                                                                                                                              |
| --- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A   | Controller couples UI primitives (`useModal`, `useAlert`, `useI18n`, `emitSfx`, `MoveCardsModal`) | Deliberate. Factoring them out as callbacks was considered and rejected for one-call-site boilerplate. Revisit if the controller needs to run headless (e.g. a bulk-import tool). |
| B   | `addCard()` with no args lands mid-deck when `hasNextPage` is true                                | Documented inline in `virtual-card-list.ts:addCard`. Proper fix: gate the global "+ card" affordance on `!hasNextPage`, or make `addCard` load all pages first.                   |
| C   | `saving` flag is global, not per-card                                                             | User editing two cards quickly can't tell which is in-flight. If relevant UX, add `saving_card_ids: Ref<Set<number>>` to mutations.                                               |

---

## Controller public surface (current)

For reference when wiring tests / new consumers:

```ts
{
  // list — read + actions
  all_cards, getKey, addCard, appendCard, prependCard,

  // selection — read + actions
  isCardSelected, selectCard, deselectCard, toggleSelectCard,
  selectAllCards, clearSelectedCards, toggleSelectAll,
  selected_card_ids, deselected_ids, select_all_mode,
  selected_count, all_cards_selected, total_card_count,

  // mutations (consumer-facing only)
  saving, updateCard,

  // deck-derived
  card_attributes, deck_id,

  // UI state
  mode, setMode,

  // infinite scroll
  hasNextPage, isLoading, observeSentinel,

  // intent
  onCancel, onDeleteCards, onSelectCard, onMoveCards,
}
```

---

## Gotchas for the next session

- `vp fmt` / `vp check --fix` will reformat unrelated markdown across
  `.claude/rules/`, `.claude/skills/`, `CLAUDE.md`. Run `git restore
--source=master --` on those before committing. Same applies to any file
  you haven't intentionally touched.
- Baseline test count going into the next session should be 1067. If it
  differs, something regressed before you started.
- `vp dlx vue-tsc --noEmit -p tsconfig.app.json` is the typecheck invocation
  (`vp check` does not run tsc).
- Pinia Colada mutation signature differs slightly from TanStack — check
  `src/api/cards/mutations/save.ts` for the current `onSettled` shape before
  adding `onMutate` in step #1.
