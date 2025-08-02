import { ref } from 'vue'

export function useSelection(cards: Card[]) {
  const selected_card_ids = ref<number[]>([])
  const current_card_index = ref<number>(-1)
  const current_column = ref<'front' | 'back'>('front')
  const selection_start = ref(0)
  const navigating = ref(false)

  function selectCard(id?: number) {
    if (!id) return

    const index = selected_card_ids.value.indexOf(id)
    if (index === -1) selected_card_ids.value.push(id)
  }

  function deselectCard(id: number) {
    const index = selected_card_ids.value.indexOf(id)
    if (index !== -1) selected_card_ids.value.splice(index, 1)
  }

  function clearSelection() {
    selected_card_ids.value = []
  }

  function navigate(direction: 'up' | 'down') {
    if (navigating.value) return

    navigating.value = true

    if (current_card_index.value === undefined || current_card_index.value < 0) return

    const newIndex =
      direction === 'up' ? current_card_index.value - 1 : current_card_index.value + 1

    if (newIndex >= 0 && newIndex < (cards.length ?? Infinity)) {
      current_card_index.value = newIndex
    }

    requestAnimationFrame(() => {
      navigating.value = false
    })
  }

  function setSelectionStart(start?: number) {
    selection_start.value = start ?? 0
  }

  function setCurrentCard(index?: number) {
    current_card_index.value = index ?? -1
  }

  function setCurrentColumn(column: 'front' | 'back') {
    current_column.value = column
  }

  return {
    selected_card_ids,
    current_card_index,
    current_column,
    selection_start,
    navigating,
    setCurrentCard,
    setCurrentColumn,
    navigate,
    setSelectionStart,
    selectCard,
    deselectCard,
    clearSelection
  }
}
