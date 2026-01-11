import { computed, ref } from 'vue'
import { upsertCard, deleteCards as upstreamDeleteCards, reserveCard } from '@/api/cards'
import { debounce } from '@/utils/debounce'
import CardRecord from '@/utils/card-record'

export type CardEditorMode = 'view' | 'select' | 'edit'
export type CardBulkEditor = ReturnType<typeof useCardBulkEditor>

export function useCardBulkEditor(initial_cards: Card[], _deck_id: number) {
  const all_cards = ref<CardRecord[]>(initial_cards.map((card) => new CardRecord(card)))
  const deck_id = ref<number | undefined>(_deck_id)
  const selected_card_ids = ref<number[]>([])
  const mode = ref<CardEditorMode>('view')
  const saving = ref(false)

  const all_cards_selected = computed(() => {
    return selected_card_ids.value.length === all_cards.value.length
  })

  async function updateCard(id: number, values: Partial<Card>) {
    const record = all_cards.value.find((card) => card.id === id)

    saving.value = true
    await record?.update(values)
    saving.value = false
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
      return selected_cards.map(({ review, ...rest }) => rest)
    }

    return selected_cards
  }

  function resetCards(cards: Card[], _deck_id?: number) {
    all_cards.value = cards.map((card) => new CardRecord(card))
    deck_id.value = _deck_id ?? deck_id.value
  }

  function setMode(new_mode: CardEditorMode) {
    mode.value = new_mode
  }

  async function addCard(left_card_id?: number, right_card_id?: number) {
    if (!left_card_id && !right_card_id) {
      const last_card = all_cards.value?.at(-1)
      left_card_id = last_card?.id
    }

    const record = await CardRecord.create(deck_id.value!, left_card_id, right_card_id)

    let index = all_cards.value.findIndex((card) => card.rank! > record.rank!)
    if (index === -1) {
      index = all_cards.value.length // append at end
    }

    all_cards.value.splice(index, 0, record)
  }

  async function deleteCards() {
    const cards = getSelectedCards().filter((card) => card.id !== undefined)

    if (cards.length <= 0) return

    try {
      await upstreamDeleteCards(cards)
    } catch (e: any) {
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
    resetCards
  }
}
