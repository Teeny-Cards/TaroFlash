import { reactive, computed, toRaw } from 'vue'

export type EditableCard = {
  id?: number
  front_text: string
  back_text: string
  order?: number
  [key: string]: any
}

export function useEditableCards(initialCards: EditableCard[], deck_id?: number) {
  const editedCards = reactive(initialCards.map((card) => ({ ...card })))
  const dirtyMap = reactive(new Set<number>())

  const nextOrder = computed(() => {
    if (editedCards.length === 0) return 1
    return Math.max(...editedCards.map((card) => card.order ?? 0)) + 1
  })

  function addCard() {
    editedCards.unshift({
      front_text: '',
      back_text: '',
      order: nextOrder.value,
      deck_id
    })
  }

  function updateCard(id: number, key: string, value: string) {
    const card = editedCards.find((c) => c.id === id)
    if (!card) return

    if (card[key] !== value) {
      card[key] = value
      dirtyMap.add(id)
    }
  }

  function getChangedCards(): EditableCard[] {
    return editedCards
      .filter((card) => dirtyMap.has(card.id ?? 0) || !card.id)
      .map((card) => toRaw(card))
  }

  function resetChanges() {
    initialCards.forEach((card, i) => {
      Object.assign(editedCards[i], { ...card })
    })
    dirtyMap.clear()
  }

  return {
    editedCards,
    dirtyMap,
    addCard,
    updateCard,
    getChangedCards,
    resetChanges,
    isDirty: computed(() => dirtyMap.size > 0)
  }
}
