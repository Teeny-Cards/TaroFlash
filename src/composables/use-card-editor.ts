import { computed, toRaw, ref } from 'vue'
import { updateCards, deleteCardsById } from '@/services/card-service'

export type EditableCard = {
  id?: number
  front_text: string
  back_text: string
  order?: number
  deleted?: boolean
  [key: string]: any
}

export function useCardEditor(initialCards: EditableCard[], _deck_id?: number) {
  const edited_cards = ref(initialCards.map((card) => ({ ...card })))
  let initial_cards = initialCards

  const deck_id = ref<number | undefined>(_deck_id)
  const dirty_map = ref(new Set<number>())
  const active_card_id = ref<number | undefined>()
  const selected_card_ids = ref<number[]>([])

  const nextOrder = computed(() => {
    if (edited_cards.value.length === 0) return 1
    return Math.max(...edited_cards.value.map((card) => card.order ?? 0)) + 1
  })

  function addCard() {
    edited_cards.value.unshift({
      front_text: '',
      back_text: '',
      order: nextOrder.value,
      deck_id
    })
  }

  async function deleteCard(id?: number) {
    if (!id) return
    await deleteCardsById([id])
  }

  function updateCard(id: number, key: string, value: string) {
    const card = edited_cards.value.find((c) => c.id === id)
    if (!card) return

    if (card[key] !== value) {
      card[key] = value
      dirty_map.value.add(id)
    }
  }

  function selectCard(id?: number) {
    if (!id) return
    const index = selected_card_ids.value.findIndex((c) => c === id)

    if (index === -1) {
      selected_card_ids.value.push(id)
    } else {
      selected_card_ids.value.splice(index, 1)
    }
  }

  function deselectCard(id: number) {
    const index = selected_card_ids.value.indexOf(id)
    if (index !== -1) selected_card_ids.value.splice(index, 1)
  }

  function clearSelection() {
    selected_card_ids.value = []
  }

  function setActiveCard(id?: number) {
    active_card_id.value = id ?? -1
  }

  function getChangedCards(): EditableCard[] {
    return edited_cards.value
      .filter((card) => dirty_map.value.has(card.id ?? 0) || !card.id)
      .map((card) => toRaw(card))
  }

  function getDeletedCards(): number[] {
    return edited_cards.value.filter((card) => card.deleted).map((card) => card.id!)
  }

  function resetCards(cards?: Card[], _deck_id?: number) {
    edited_cards.value = (cards ?? initial_cards).map((card) => ({ ...card }))
    initial_cards = cards ?? initial_cards

    deck_id.value = _deck_id ?? deck_id.value
    dirty_map.value.clear()
  }

  async function tryDeleteCards() {
    const ids = getDeletedCards()
    if (ids.length === 0) return

    await deleteCardsById(ids)
  }

  async function saveCards() {
    const changed = getChangedCards()
    if (!changed) return

    if (changed.length > 0) {
      try {
        await updateCards(changed)
        await tryDeleteCards()
      } catch (e: any) {
        // TODO
      }
    }
  }

  return {
    edited_cards,
    dirty_map,
    active_card_id,
    selected_card_ids,
    addCard,
    deleteCard,
    updateCard,
    selectCard,
    deselectCard,
    clearSelection,
    setActiveCard,
    getChangedCards,
    resetCards,
    saveCards,
    isDirty: computed(
      () => dirty_map.value.size > 0 || edited_cards.value.length !== initialCards.length
    )
  }
}
