import { computed, ref } from 'vue'
import { updateCards, deleteCardsById } from '@/api/cards'

export const MAX_INPUT_LENGTH = 660
export type EditableCard = Card & { deleted?: boolean; dirty?: boolean; new?: boolean }
export type EditableCardKey = keyof EditableCard
export type EditableCardValue = EditableCard[keyof EditableCard]
export type CardEditorMode = 'edit' | 'edit-one' | 'view' | 'select'

export function useCardBulkEditor(initialCards: Card[], _deck_id?: number) {
  const edited_cards = ref<EditableCard[]>(initialCards.map((card) => ({ ...card })))
  let initial_cards = initialCards

  const deck_id = ref<number | undefined>(_deck_id)
  const active_card_id = ref<number | undefined>()
  const selected_card_ids = ref<number[]>([])
  const mode = ref<CardEditorMode>('view')

  const next_order = computed(() => {
    if (edited_cards.value.length === 0) return 1
    return Math.max(...edited_cards.value.map((card) => card.order ?? 0)) + 1
  })

  const all_cards_selected = computed(() => {
    return selected_card_ids.value.length === edited_cards.value.length
  })

  const is_dirty = computed(() => edited_cards.value.some((card) => card.dirty))

  function addCard() {
    const temp_id = Math.floor(Math.random() * 1000000)

    edited_cards.value.push({
      id: temp_id, // Temporary id for editing, is removed before save
      order: next_order.value,
      deck_id: deck_id.value,
      back_text: '',
      front_text: '',
      new: true
    })

    activateCard(temp_id)
  }

  function updateCard(id: number, key: EditableCardKey, value: EditableCardValue) {
    const card = edited_cards.value.find((card) => card.id === id)
    if (!card) return

    const processed_value = value

    if (card[key] !== processed_value) {
      ;(card as any)[key] = processed_value
      card.dirty = true
    }
  }

  function selectCard(id: number) {
    if (selected_card_ids.value.includes(id)) return

    selected_card_ids.value.push(id)
  }

  function selectAllCards() {
    selected_card_ids.value = edited_cards.value
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

  function deactivateCard(id?: number) {
    if (id === active_card_id.value) {
      active_card_id.value = undefined
    }
  }

  function getChangedCards(): Card[] {
    return edited_cards.value
      .filter((card) => card.dirty || card.new)
      .map(({ deleted, dirty, new: _new, ...clean_card }) => {
        if (_new) {
          const { id, ...sanitized } = clean_card
          clean_card = sanitized
        }

        return clean_card
      })
  }

  function getSelectedCards(clean = true): Card[] {
    const selected_cards = edited_cards.value.filter(
      (card) => card.id !== undefined && selected_card_ids.value.includes(card.id)
    )

    if (clean) {
      return selected_cards.map(({ deleted, dirty, new: _new, review, ...rest }) => rest)
    }

    return selected_cards
  }

  function resetCards(cards?: Card[], _deck_id?: number) {
    edited_cards.value = (cards ?? initial_cards).map((card) => ({ ...card }))
    initial_cards = cards ?? initial_cards
    deck_id.value = _deck_id ?? deck_id.value
  }

  async function setMode(new_mode: CardEditorMode, reset = true) {
    mode.value = new_mode

    if (reset) {
      resetEdits()
    }
  }

  function resetEdits() {
    resetCards()
    clearSelectedCards()
    deactivateCard(active_card_id.value)
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
    getChangedCards,
    getSelectedCards,
    setMode,
    resetCards,
    saveCards,
    resetEdits
  }
}
