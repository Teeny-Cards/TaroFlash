import { computed, ref } from 'vue'
import { upsertCards, upsertCard, deleteCardsById } from '@/api/cards'
import { debounce } from '@/utils/debounce'

export const MAX_INPUT_LENGTH = 660
export type EditableCard = Card & { dirty?: boolean }
export type EditableCardKey = keyof EditableCard
export type EditableCardValue = EditableCard[keyof EditableCard]
export type CardEditorMode = 'edit' | 'edit-one' | 'view' | 'select'

export function useCardBulkEditor(initial_cards: Card[], _deck_id?: number) {
  const all_cards = ref<EditableCard[]>(initial_cards)
  const deck_id = ref<number | undefined>(_deck_id)
  const active_card_id = ref<number | undefined>()
  const selected_card_ids = ref<number[]>([])
  const mode = ref<CardEditorMode>('view')

  const next_order = computed(() => {
    if (all_cards.value.length === 0) return 1
    return Math.max(...all_cards.value.map((card) => card.order ?? 0)) + 1
  })

  const all_cards_selected = computed(() => {
    return selected_card_ids.value.length === all_cards.value.length
  })

  async function addCard() {
    const temp_id = Math.floor(Math.random() * 1000000)

    const optimistic: Card = {
      id: temp_id,
      order: next_order.value,
      deck_id: deck_id.value,
      front_text: '',
      back_text: ''
    }

    all_cards.value.push(optimistic)
    activateCard(temp_id)

    try {
      const { id, ...new_card } = optimistic
      const response = await upsertCard(new_card)
      const idx = all_cards.value.findIndex((c) => c.id === temp_id)

      if (idx === -1) return

      const saved: Card = {
        ...optimistic,
        id: response.id
      }

      all_cards.value.splice(idx, 1, saved)
      all_cards.value = [...all_cards.value]

      if (active_card_id.value === temp_id) activateCard(saved.id!)
    } catch (err) {
      const idx = all_cards.value.findIndex((c) => c.id === temp_id)

      if (idx !== -1) {
        all_cards.value.splice(idx, 1)
      }

      throw err
    }
  }

  function updateCard(id: number, key: EditableCardKey, value: EditableCardValue) {
    const card = all_cards.value.find((card) => card.id === id)
    if (!card) return

    if (card[key] !== value) {
      ;(card as any)[key] = value
      card.dirty = true
    }

    debounce(saveCards, 300)
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
      try {
        await upsertCards(dirty_cards)
      } catch (e: any) {
        // TODO
      }
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
    selectAllCards,
    toggleSelectAll,
    deselectCard,
    toggleSelectCard,
    clearSelectedCards,
    activateCard,
    deactivateCard,
    getSelectedCards,
    setMode,
    resetCards,
    saveCards,
    resetEdits
  }
}
