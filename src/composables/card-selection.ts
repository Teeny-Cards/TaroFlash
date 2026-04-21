import { computed, ref } from 'vue'
import type { useDeckCardIdsQuery } from '@/api/cards'

export type CardSelection = ReturnType<typeof useCardSelection>

type IdsQuery = ReturnType<typeof useDeckCardIdsQuery>

// A2 model: positive list OR (select-all + deselected list). When
// `select_all_mode` is true every card in the deck is conceptually selected
// EXCEPT those in `deselected_ids`. Avoids materializing a 10k-element id
// array client-side.
export function useCardSelection(ids_query: IdsQuery) {
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

  function filterSelected(cards: Card[]): Card[] {
    return cards.filter((card) => {
      if (card.id === undefined) return false
      return isCardSelected(card.id)
    })
  }

  return {
    selected_card_ids,
    deselected_ids,
    select_all_mode,
    total_card_count,
    selected_count,
    all_cards_selected,
    isCardSelected,
    selectCard,
    deselectCard,
    toggleSelectCard,
    selectAllCards,
    clearSelectedCards,
    toggleSelectAll,
    filterSelected
  }
}
