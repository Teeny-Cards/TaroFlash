import { computed, ref } from 'vue'
import { deleteCards as upstreamDeleteCards } from '@/api/cards'
import { insertCard } from '@/api/cards'
import { saveCard } from '@/api/cards'

// TODO: Add error handling for all async functions

export type CardEditorMode = 'view' | 'select' | 'edit'
export type CardBulkEditor = ReturnType<typeof useCardBulkEditor>

// Monotonically decreasing counter for in-memory-only cards. Negative IDs
// cannot collide with real bigserial IDs from Postgres (which are always
// positive), so `card.id < 0` is a reliable "not yet persisted" sentinel.
let temp_id_counter = 0
function nextTempId(): number {
  return --temp_id_counter
}

export function useCardBulkEditor(initial_cards: Card[], _deck_id: number) {
  const all_cards = ref<Card[]>([...initial_cards])
  const deck_id = ref<number | undefined>(_deck_id)
  const selected_card_ids = ref<number[]>([])
  const mode = ref<CardEditorMode>('view')
  const saving = ref(false)

  const all_cards_selected = computed(() => {
    return selected_card_ids.value.length === all_cards.value.length
  })

  async function updateCard(id: number, values: Partial<Card>) {
    const card = all_cards.value.find((c) => c.id === id)
    if (!card) return

    saving.value = true
    try {
      if (card.id < 0) {
        // First save of a temp card — insert on the server, then swap the
        // temp id for the real one. Neighbors are derived from the array's
        // current order (skipping other temp cards).
        const { left_card_id, right_card_id } = findRealNeighbors(card.id)
        const inserted = await insertCard({
          deck_id: deck_id.value!,
          left_card_id,
          right_card_id,
          front_text: values.front_text ?? card.front_text ?? '',
          back_text: values.back_text ?? card.back_text ?? ''
        })
        card.id = inserted.id
        card.rank = inserted.rank
        Object.assign(card, values)
      } else {
        await saveCard(card, values)
      }
    } finally {
      saving.value = false
    }
  }

  // Walks the local array outward from a temp card to find its nearest
  // persisted neighbors on either side. Neighbors that are themselves temp
  // (id < 0) are skipped — only real IDs can be sent to the server.
  function findRealNeighbors(temp_id: number): {
    left_card_id: number | null
    right_card_id: number | null
  } {
    const idx = all_cards.value.findIndex((c) => c.id === temp_id)
    let left_card_id: number | null = null
    let right_card_id: number | null = null

    for (let i = idx - 1; i >= 0; i--) {
      const id = all_cards.value[i].id
      if (id !== undefined && id > 0) {
        left_card_id = id
        break
      }
    }
    for (let i = idx + 1; i < all_cards.value.length; i++) {
      const id = all_cards.value[i].id
      if (id !== undefined && id > 0) {
        right_card_id = id
        break
      }
    }

    return { left_card_id, right_card_id }
  }

  function selectCard(id: number) {
    if (selected_card_ids.value.includes(id)) return
    selected_card_ids.value.push(id)
  }

  function selectAllCards() {
    selected_card_ids.value = all_cards.value
      .filter((card) => card.id !== undefined)
      .map((card) => card.id!)
  }

  function toggleSelectAll() {
    if (all_cards_selected.value) {
      clearSelectedCards()
    } else {
      selectAllCards()
    }
  }

  function deselectCard(id: number) {
    const i = selected_card_ids.value.indexOf(id)
    if (i !== -1) selected_card_ids.value.splice(i, 1)
  }

  function toggleSelectCard(id: number) {
    if (selected_card_ids.value.includes(id)) {
      deselectCard(id)
    } else {
      selectCard(id)
    }
  }

  function clearSelectedCards() {
    selected_card_ids.value = []
  }

  function getSelectedCards(clean = true): Card[] {
    const selected_cards = all_cards.value.filter(
      (card) => card.id !== undefined && selected_card_ids.value.includes(card.id)
    )

    if (clean) {
      return selected_cards.map(({ review: _review, ...rest }) => rest as Card)
    }

    return selected_cards
  }

  function resetCards(cards: Card[], _deck_id?: number) {
    all_cards.value = [...cards]
    deck_id.value = _deck_id ?? deck_id.value
  }

  function setMode(new_mode: CardEditorMode) {
    mode.value = new_mode
  }

  function isDuplicate(card: Card) {
    const non_empty_cards = all_cards.value.filter((c) => c.front_text !== '' || c.back_text !== '')

    return (
      non_empty_cards.filter(
        (c) => c.front_text === card.front_text || c.back_text === card.back_text
      ).length > 1
    )
  }

  function appendCard(card_id: number) {
    const other_card = all_cards.value[all_cards.value.findIndex((c) => c.id === card_id) + 1]
    addCard(card_id, other_card?.id)
  }

  function prependCard(card_id: number) {
    const other_card = all_cards.value[all_cards.value.findIndex((c) => c.id === card_id) - 1]
    addCard(other_card?.id, card_id)
  }

  // In-memory only. No network call until the user types into the card
  // and `updateCard` promotes the temp row to a real INSERT (see above).
  function addCard(left_card_id?: number, right_card_id?: number) {
    if (!left_card_id && !right_card_id) {
      left_card_id = all_cards.value.at(-1)?.id
    }

    const new_card: Card = {
      id: nextTempId(),
      rank: 0,
      deck_id: deck_id.value,
      front_text: '',
      back_text: ''
    }

    // Position by neighbor id, not rank — a temp card has no real rank yet.
    let index: number
    if (left_card_id !== undefined) {
      const left_idx = all_cards.value.findIndex((c) => c.id === left_card_id)
      index = left_idx >= 0 ? left_idx + 1 : all_cards.value.length
    } else if (right_card_id !== undefined) {
      const right_idx = all_cards.value.findIndex((c) => c.id === right_card_id)
      index = right_idx >= 0 ? right_idx : 0
    } else {
      index = all_cards.value.length
    }

    all_cards.value.splice(index, 0, new_card)
  }

  async function deleteCards() {
    const cards = getSelectedCards().filter((card) => card.id !== undefined)

    if (cards.length <= 0) return

    try {
      await upstreamDeleteCards(cards)
    } catch {
      // TODO
    } finally {
      clearSelectedCards()
    }
  }

  return {
    all_cards,
    selected_card_ids,
    all_cards_selected,
    mode,
    saving,
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
    resetCards,
    isDuplicate,
    appendCard,
    prependCard
  }
}
