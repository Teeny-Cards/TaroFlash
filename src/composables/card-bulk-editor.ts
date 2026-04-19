import { computed, ref } from 'vue'
import {
  useCardsInDeckInfiniteQuery,
  useDeckCardIdsQuery,
  useDeleteCardsMutation,
  useDeleteCardsInDeckMutation,
  useInsertCardAtMutation,
  useSaveCardMutation
} from '@/api/cards'

// TODO: Add error handling for all async functions

export type CardEditorMode = 'view' | 'select' | 'edit'
export type CardBulkEditor = ReturnType<typeof useCardBulkEditor>

type CardsQuery = ReturnType<typeof useCardsInDeckInfiniteQuery>
type IdsQuery = ReturnType<typeof useDeckCardIdsQuery>

type TempCardEntry = {
  card: Card
  anchor_id: number | null
  side: 'before' | 'after' | null
}

// Monotonically decreasing counter for in-memory-only cards. Negative IDs
// cannot collide with real bigserial IDs from Postgres (which are always
// positive), so `card.id < 0` is a reliable "not yet persisted" sentinel.
let temp_id_counter = 0
function nextTempId(): number {
  return --temp_id_counter
}

let local_key_counter = 0
function nextLocalKey(): string {
  return `lk-${++local_key_counter}`
}

export function useCardBulkEditor(cards_query: CardsQuery, ids_query: IdsQuery, _deck_id: number) {
  const deck_id = ref<number | undefined>(_deck_id)
  const mode = ref<CardEditorMode>('view')
  const saving = ref(false)

  // ── Persisted cards (from infinite query) merged with in-flight temp cards.
  const temp_cards = ref<TempCardEntry[]>([])

  // Stable v-for keys that survive the temp → real id transition AND the
  // cache-refetch handoff (where the persisted card object replaces the temp
  // instance with a fresh reference). Keyed by whatever id the card currently
  // has; on promotion the entry is migrated from the negative temp id to the
  // real persisted id.
  const local_keys = new Map<number, string>()

  function getKey(card: Card): string | number {
    if (card.id === undefined) return Math.random()
    return local_keys.get(card.id) ?? card.id
  }

  const persisted_cards = computed<Card[]>(() => {
    return (cards_query.data.value?.pages ?? []).flat() as Card[]
  })

  // Set of promoted-temp ids. Once a temp's id has been swapped to a real one
  // (after insertCardAt success), the same id will eventually appear in the
  // refetched persisted_cards. We dedupe on id and keep the temp's instance
  // as the canonical render source so the v-for entry doesn't churn.
  const promoted_temp_ids = computed(() => {
    const set = new Set<number>()
    for (const t of temp_cards.value) {
      if (t.card.id !== undefined && t.card.id > 0) set.add(t.card.id)
    }
    return set
  })

  // The displayed list = persisted ∪ temp, with each temp inserted at its
  // anchor position. When a temp's anchor isn't loaded (e.g. user inserted
  // after a card on page 3 then scrolled back to page 1), the temp falls back
  // to "append to the loaded set" — visually wrong but rare and self-correcting
  // when the anchor's page becomes visible again.
  const all_cards = computed<Card[]>(() => {
    const persisted = persisted_cards.value.filter(
      (c) => c.id === undefined || !promoted_temp_ids.value.has(c.id)
    )
    const merged: Card[] = [...persisted]

    for (const temp of temp_cards.value) {
      if (temp.anchor_id === null) {
        merged.push(temp.card)
        continue
      }
      const idx = merged.findIndex((c) => c.id === temp.anchor_id)
      if (idx === -1) {
        merged.push(temp.card)
      } else {
        const insert_at = temp.side === 'after' ? idx + 1 : idx
        merged.splice(insert_at, 0, temp.card)
      }
    }

    return merged
  })

  // ── Selection — A2 model: positive list OR (select-all + deselected list).
  // When `select_all_mode` is true, every card in the deck is conceptually
  // selected EXCEPT those in `deselected_ids`. This avoids ever materializing
  // a 10k-element id array client-side.
  const selected_card_ids = ref<number[]>([])
  const deselected_ids = ref<number[]>([])
  const select_all_mode = ref(false)

  const total_card_count = computed(() => ids_query.data.value?.length ?? 0)

  const selected_count = computed(() => {
    if (select_all_mode.value) {
      return Math.max(0, total_card_count.value - deselected_ids.value.length)
    }
    return selected_card_ids.value.length
  })

  const all_cards_selected = computed(() => {
    if (select_all_mode.value) return deselected_ids.value.length === 0
    return total_card_count.value > 0 && selected_card_ids.value.length === total_card_count.value
  })

  function isCardSelected(id: number): boolean {
    if (select_all_mode.value) return !deselected_ids.value.includes(id)
    return selected_card_ids.value.includes(id)
  }

  function selectCard(id: number) {
    if (select_all_mode.value) {
      const i = deselected_ids.value.indexOf(id)
      if (i !== -1) deselected_ids.value.splice(i, 1)
      return
    }
    if (!selected_card_ids.value.includes(id)) selected_card_ids.value.push(id)
  }

  function deselectCard(id: number) {
    if (select_all_mode.value) {
      if (!deselected_ids.value.includes(id)) deselected_ids.value.push(id)
      return
    }
    const i = selected_card_ids.value.indexOf(id)
    if (i !== -1) selected_card_ids.value.splice(i, 1)
  }

  function toggleSelectCard(id: number) {
    if (isCardSelected(id)) deselectCard(id)
    else selectCard(id)
  }

  function selectAllCards() {
    select_all_mode.value = true
    deselected_ids.value = []
    selected_card_ids.value = []
  }

  function clearSelectedCards() {
    select_all_mode.value = false
    deselected_ids.value = []
    selected_card_ids.value = []
  }

  function toggleSelectAll() {
    if (all_cards_selected.value) clearSelectedCards()
    else selectAllCards()
  }

  // ── Mutations
  const delete_mutation = useDeleteCardsMutation()
  const delete_in_deck_mutation = useDeleteCardsInDeckMutation()
  const insert_mutation = useInsertCardAtMutation()
  const save_mutation = useSaveCardMutation()

  // Returns only LOADED selected cards. In select-all mode this set is
  // incomplete by design — flows that need the full set (e.g. cross-deck
  // move) should disable themselves when select-all-mode is active.
  function getSelectedCards(clean = true): Card[] {
    const cards = persisted_cards.value.filter((card) => {
      if (card.id === undefined) return false
      return isCardSelected(card.id)
    })
    if (clean) return cards.map(({ review: _review, ...rest }) => rest as Card)
    return cards
  }

  async function updateCard(id: number, values: Partial<Card>) {
    // Temp card path — first save promotes it to a real INSERT.
    if (id < 0) {
      const temp_idx = temp_cards.value.findIndex((t) => t.card.id === id)
      if (temp_idx === -1) return
      const temp = temp_cards.value[temp_idx]

      saving.value = true
      try {
        const inserted = await insert_mutation.mutateAsync({
          deck_id: deck_id.value!,
          anchor_id: temp.anchor_id,
          side: temp.side,
          front_text: values.front_text ?? temp.card.front_text ?? '',
          back_text: values.back_text ?? temp.card.back_text ?? ''
        })
        // Promote in place: keep the same temp.card object reference (so
        // any text-editor bound to it stays mounted) and migrate the v-for
        // key entry from the old negative id to the new real id. The temp
        // stays in `temp_cards` so the merge keeps using its instance even
        // after the cache refetch arrives with a fresh persisted copy.
        const old_id = temp.card.id
        const old_key = local_keys.get(old_id) ?? nextLocalKey()
        local_keys.delete(old_id)
        local_keys.set(inserted.id, old_key)
        temp.card.id = inserted.id
        temp.card.rank = inserted.rank
        Object.assign(temp.card, values)
      } finally {
        saving.value = false
      }
      return
    }

    // Real card path — debounced in-place save.
    const card = all_cards.value.find((c) => c.id === id)
    if (!card) return

    saving.value = true
    try {
      await save_mutation.mutateAsync({ card, values })
    } finally {
      saving.value = false
    }
  }

  async function deleteCards() {
    if (selected_count.value <= 0) return

    try {
      if (select_all_mode.value) {
        await delete_in_deck_mutation.mutateAsync({
          deck_id: deck_id.value!,
          except_ids: deselected_ids.value.slice()
        })
      } else {
        const cards = getSelectedCards()
        if (cards.length === 0) return
        await delete_mutation.mutateAsync(cards)
      }
    } catch {
      // TODO
    } finally {
      clearSelectedCards()
    }
  }

  function setMode(new_mode: CardEditorMode) {
    mode.value = new_mode
  }

  // ── Add / append / prepend — all push to temp_cards with an anchor + side.

  function addCard(left_card_id?: number, right_card_id?: number) {
    let anchor_id: number | null = null
    let side: 'before' | 'after' | null = null

    if (left_card_id !== undefined) {
      anchor_id = left_card_id
      side = 'after'
    } else if (right_card_id !== undefined) {
      anchor_id = right_card_id
      side = 'before'
    } else {
      // No explicit neighbor — append after the last loaded card. Note:
      // when `cards_query.hasNextPage` is true, this lands the new card
      // mid-deck rather than at the true end. UI should gate the global
      // "add card" affordance accordingly (e.g. only show it once all
      // pages are loaded).
      const last = persisted_cards.value.at(-1)
      if (last?.id !== undefined) {
        anchor_id = last.id
        side = 'after'
      }
    }

    const temp_id = nextTempId()
    local_keys.set(temp_id, nextLocalKey())

    const new_card: Card = {
      id: temp_id,
      rank: 0,
      deck_id: deck_id.value,
      front_text: '',
      back_text: ''
    }

    temp_cards.value.push({ card: new_card, anchor_id, side })
  }

  function appendCard(card_id: number) {
    addCard(card_id)
  }

  function prependCard(card_id: number) {
    addCard(undefined, card_id)
  }

  return {
    all_cards,
    persisted_cards,
    selected_card_ids,
    deselected_ids,
    select_all_mode,
    selected_count,
    total_card_count,
    all_cards_selected,
    mode,
    saving,
    isCardSelected,
    getKey,
    addCard,
    deleteCards,
    updateCard,
    selectCard,
    deselectCard,
    selectAllCards,
    toggleSelectAll,
    toggleSelectCard,
    clearSelectedCards,
    getSelectedCards,
    setMode,
    appendCard,
    prependCard
  }
}
