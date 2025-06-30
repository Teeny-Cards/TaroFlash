import { reactive, computed, toRaw } from 'vue'

export type EditableCard = {
  id?: number
  front_text: string
  back_text: string
  [key: string]: any
}

export function useEditableCards(initialCards: EditableCard[]) {
  const editedCards = reactive(initialCards.map((card) => ({ ...card })))
  const dirtyMap = reactive(new Set<number>())

  function updateCard(id: number, key: string, value: string) {
    const card = editedCards.find((c) => c.id === id)
    if (!card) return

    if (card[key] !== value) {
      card[key] = value
      dirtyMap.add(id)
    }
  }

  function getChangedCards(): EditableCard[] {
    return editedCards.filter((card) => dirtyMap.has(card.id ?? 0)).map(toRaw)
  }

  function resetChanges() {
    initialCards.forEach((card, i) => {
      Object.assign(editedCards[i], { ...card })
    })
    dirtyMap.clear()
  }

  function markAllClean() {
    dirtyMap.clear()
  }

  return {
    editedCards,
    dirtyMap,
    updateCard,
    getChangedCards,
    resetChanges,
    markAllClean,
    isDirty: computed(() => dirtyMap.size > 0)
  }
}
