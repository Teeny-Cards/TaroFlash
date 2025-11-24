import { computed, ref } from 'vue'
import { upsertCard, deleteCards as upstreamDeleteCards, reserveCard } from '@/api/cards'
import { debounce } from '@/utils/debounce'

export type CardEditorMode = 'edit' | 'view' | 'select'

export function useCardBulkEditor(initial_cards: Card[], _deck_id: number) {
  const all_cards = ref<Card[]>(initial_cards)
  const deck_id = ref<number | undefined>(_deck_id)
  const active_card_id = ref<number | undefined>()
  const selected_card_ids = ref<number[]>([])
  const mode = ref<CardEditorMode>('view')

  const all_cards_selected = computed(() => {
    return selected_card_ids.value.length === all_cards.value.length
  })

  function updateCard(id: number, values: Partial<Card>, removed_image_ids: string[] = []) {
    const idx = all_cards.value.findIndex((card) => card.id === id)
    if (idx === -1) return

    const prev = all_cards.value[idx]

    const mergedAttributes = {
      ...prev.attributes,
      ...(values.attributes ?? {})
    }

    const merged_image_ids = [...(prev.image_ids ?? []), ...(values.image_ids ?? [])]
    const unique_image_ids = [...new Set(merged_image_ids)].filter(
      (id) => !removed_image_ids?.includes(id)
    )

    const updated: Card = {
      ...prev,
      ...values,
      attributes: mergedAttributes,
      image_ids: unique_image_ids
    }

    all_cards.value[idx] = updated

    return debounce(async () => await upsertCard(updated))
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

  function activateCard(id: number) {
    active_card_id.value = id
  }

  function deactivateCard() {
    active_card_id.value = undefined
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
    all_cards.value = cards
    deck_id.value = _deck_id ?? deck_id.value
  }

  function setMode(new_mode: CardEditorMode) {
    mode.value = new_mode
  }

  async function addCard() {
    const last_card = all_cards.value?.at(-1)
    const { out_rank: rank, out_id: id } = await reserveCard(deck_id.value!, last_card?.id)
    all_cards.value.push({ id, rank })
    activateCard(id)
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
    active_card_id,
    selected_card_ids,
    all_cards_selected,
    mode,
    addCard,
    deleteCards,
    updateCard,
    selectCard,
    deselectCard,
    selectAllCards,
    toggleSelectAll,
    toggleSelectCard,
    clearSelectedCards,
    activateCard,
    deactivateCard,
    getSelectedCards,
    setMode,
    resetCards
  }
}
