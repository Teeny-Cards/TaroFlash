import { computed, ref } from 'vue'
import { updateCards, deleteCardsById } from '@/services/card-service'

export type EditableCard = Card & { deleted?: boolean; dirty?: boolean; new?: boolean }
export type EditableCardKey = keyof EditableCard
export type EditableCardValue = EditableCard[keyof EditableCard]

export function useCardEditor(initialCards: Card[], _deck_id?: number) {
  const edited_cards = ref<EditableCard[]>(initialCards.map((card) => ({ ...card })))
  let initial_cards = initialCards

  const deck_id = ref<number | undefined>(_deck_id)
  const active_card_id = ref<number | undefined>()
  const selected_card_ids = ref<number[]>([])

  const next_order = computed(() => {
    if (edited_cards.value.length === 0) return 1
    return Math.max(...edited_cards.value.map((card) => card.order ?? 0)) + 1
  })

  const all_cards_selected = computed(() => {
    return selected_card_ids.value.length === edited_cards.value.length
  })

  const is_dirty = computed(() => edited_cards.value.some((card) => card.dirty || card.new))

  function addCard() {
    edited_cards.value.unshift({
      front_text: '',
      back_text: '',
      order: next_order.value,
      deck_id: deck_id.value
    })
  }

  function updateCard(id: number, key: EditableCardKey, value: EditableCardValue) {
    const card = edited_cards.value.find((c) => c.id === id)
    if (!card) return

    if (card[key] !== value) {
      ;(card as any)[key] = value
      card.dirty = true
    }
  }

  function selectCard(id?: number) {
    if (!id) return
    const index = selected_card_ids.value.findIndex((c) => c === id)

    if (index === -1) {
      selected_card_ids.value.push(id)
    }
  }

  function selectAllCards() {
    selected_card_ids.value = edited_cards.value.map((card) => card.id!)
  }

  function toggleSelectAll() {
    if (all_cards_selected.value) {
      clearSelectedCards()
    } else {
      selectAllCards()
    }
  }

  function deselectCard(id?: number) {
    if (!id) return
    const index = selected_card_ids.value.indexOf(id)
    if (index !== -1) selected_card_ids.value.splice(index, 1)
  }

  function toggleSelectCard(id?: number) {
    if (!id) return

    const index = selected_card_ids.value.indexOf(id)
    if (index === -1) {
      selected_card_ids.value.push(id)
    } else {
      selected_card_ids.value.splice(index, 1)
    }
  }

  function clearSelectedCards() {
    selected_card_ids.value = []
  }

  function setActiveCard(id?: number) {
    active_card_id.value = id ?? -1
  }

  function getChangedCards(): Card[] {
    return edited_cards.value
      .filter((card) => card.dirty || card.new)
      .map(({ deleted, dirty, new: _new, ...rest }) => rest)
  }

  function resetCards(cards?: Card[], _deck_id?: number) {
    edited_cards.value = (cards ?? initial_cards).map((card) => ({ ...card }))
    initial_cards = cards ?? initial_cards
    deck_id.value = _deck_id ?? deck_id.value
  }

  async function deleteCards() {
    if (selected_card_ids.value.length <= 0) return

    try {
      await deleteCardsById(selected_card_ids.value)
    } catch (e: any) {
      // TODO
    } finally {
      clearSelectedCards()
    }
  }

  async function saveCards() {
    const changed = getChangedCards()

    if (changed.length > 0) {
      try {
        await updateCards(changed)
      } catch (e: any) {
        // TODO
      }
    }
  }

  return {
    edited_cards,
    active_card_id,
    selected_card_ids,
    all_cards_selected,
    is_dirty,
    addCard,
    deleteCards,
    updateCard,
    selectCard,
    selectAllCards,
    toggleSelectAll,
    deselectCard,
    toggleSelectCard,
    clearSelectedCards,
    setActiveCard,
    getChangedCards,
    resetCards,
    saveCards
  }
}
