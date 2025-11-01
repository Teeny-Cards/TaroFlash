import { computed, ref } from 'vue'
import { upsertCards, deleteCardsById, reserveCard } from '@/api/cards'
import { debounce } from '@/utils/debounce'

export const MAX_INPUT_LENGTH = 660
export type EditableCard = Card & { dirty?: boolean }
export type EditableCardKey = keyof EditableCard
export type EditableCardValue = EditableCard[keyof EditableCard]
export type CardEditorMode = 'edit' | 'view' | 'select'

export function useCardBulkEditor(initial_cards: Card[], _deck_id: number) {
  const all_cards = ref<EditableCard[]>(initial_cards)
  const deck_id = ref<number | undefined>(_deck_id)
  const active_card_id = ref<number | undefined>()
  const selected_card_ids = ref<number[]>([])
  const mode = ref<CardEditorMode>('view')

  const all_cards_selected = computed(() => {
    return selected_card_ids.value.length === all_cards.value.length
  })

  function updateCard(id: number, key: EditableCardKey, value: EditableCardValue) {
    const card = all_cards.value.find((card) => card.id === id)
    if (!card) return Promise.resolve()

    if (card[key] !== value) {
      ;(card as any)[key] = value
      card.dirty = true
    }

    return debounce(saveCards)
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

  function extractDirtyCards(): Card[] {
    const dirty_cards: EditableCard[] = []

    all_cards.value.forEach((card) => {
      if (card.dirty) {
        card.dirty = false

        const { dirty, ...clean_card } = card
        dirty_cards.push(clean_card)
      }
    })

    return dirty_cards
  }

  function getSelectedCards(clean = true): Card[] {
    const selected_cards = all_cards.value.filter(
      (card) => card.id !== undefined && selected_card_ids.value.includes(card.id)
    )

    if (clean) {
      return selected_cards.map(({ dirty, review, ...rest }) => rest)
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

  function resetEdits() {
    clearSelectedCards()
    deactivateCard()
  }

  async function addCard() {
    const { out_rank: rank, out_id: id } = await reserveCard(deck_id.value!)
    all_cards.value.push({ id, rank })
    activateCard(id)
  }

  async function deleteCards() {
    const cards = getSelectedCards()
      .map((card) => card.id)
      .filter((id) => id !== undefined)

    if (cards.length <= 0) return

    try {
      await deleteCardsById(cards)
    } catch (e: any) {
      // TODO
    } finally {
      clearSelectedCards()
    }
  }

  async function saveCards() {
    const dirty_cards = extractDirtyCards()

    if (dirty_cards.length > 0) {
      await upsertCards(dirty_cards)
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
    resetCards,
    resetEdits
  }
}
