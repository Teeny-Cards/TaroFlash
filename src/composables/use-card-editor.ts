import { computed, ref } from 'vue'
import { updateCards, deleteCardsById } from '@/services/card-service'
import { useAlert } from '@/composables/use-alert'
import { useI18n } from 'vue-i18n'
import { useAudio } from '@/composables/use-audio'

export type EditableCard = Card & { deleted?: boolean; dirty?: boolean; new?: boolean }
export type EditableCardKey = keyof EditableCard
export type EditableCardValue = EditableCard[keyof EditableCard]

export function useCardEditor(initialCards: Card[], _deck_id?: number) {
  const { t } = useI18n()
  const alert = useAlert()
  const audio = useAudio()

  const edited_cards = ref<EditableCard[]>(initialCards.map((card) => ({ ...card })))
  let initial_cards = initialCards

  const deck_id = ref<number | undefined>(_deck_id)
  const active_card_index = ref<number | undefined>()
  const selected_card_indices = ref<number[]>([])
  const mode = ref<'edit' | 'view' | 'select'>('view')

  const next_order = computed(() => {
    if (edited_cards.value.length === 0) return 1
    return Math.max(...edited_cards.value.map((card) => card.order ?? 0)) + 1
  })

  const all_cards_selected = computed(() => {
    return selected_card_indices.value.length === edited_cards.value.length
  })

  const is_dirty = computed(() => edited_cards.value.some((card) => card.dirty))

  function addCard() {
    edited_cards.value.unshift({
      front_text: '',
      back_text: '',
      order: next_order.value,
      deck_id: deck_id.value,
      new: true
    })
  }

  function updateCard(index: number, key: EditableCardKey, value: EditableCardValue) {
    const card = edited_cards.value[index]
    if (!card) return

    if (card[key] !== value) {
      ;(card as any)[key] = value
      card.dirty = true
    }
  }

  function selectCard(index: number) {
    selected_card_indices.value.push(index)
  }

  function selectAllCards() {
    selected_card_indices.value = edited_cards.value.map((_card, index) => index)
  }

  function toggleSelectAll() {
    if (all_cards_selected.value) {
      clearSelectedCards()
    } else {
      selectAllCards()
    }
  }

  function deselectCard(index: number) {
    const i = selected_card_indices.value.indexOf(index)
    if (i !== -1) selected_card_indices.value.splice(i, 1)
  }

  function toggleSelectCard(index: number) {
    if (selected_card_indices.value.includes(index)) {
      deselectCard(index)
    } else {
      selectCard(index)
    }
  }

  function clearSelectedCards() {
    selected_card_indices.value = []
  }

  function activateCard(index: number) {
    active_card_index.value = index
  }

  function deactivateCard(index?: number) {
    if (index === active_card_index.value) {
      active_card_index.value = undefined
    }
  }

  function getChangedCards(): Card[] {
    return edited_cards.value
      .filter((card) => card.dirty || card.new)
      .map(({ deleted, dirty, new: _new, ...rest }) => rest)
  }

  function getSelectedCards(): Card[] {
    return edited_cards.value.filter((card, index) => selected_card_indices.value.includes(index))
  }

  function resetCards(cards?: Card[], _deck_id?: number) {
    edited_cards.value = (cards ?? initial_cards).map((card) => ({ ...card }))
    initial_cards = cards ?? initial_cards
    deck_id.value = _deck_id ?? deck_id.value
  }

  async function setMode(new_mode: 'edit' | 'view' | 'select', reset = true) {
    mode.value = new_mode

    if (reset && (await warnIfDirty())) {
      resetEdits()
    }
  }

  function resetEdits() {
    resetCards()
    clearSelectedCards()
    deactivateCard(active_card_index.value)
  }

  function warnIfDirty() {
    if (!is_dirty.value) return true

    audio.play('etc_woodblock_stuck')

    const { response } = alert.warn({
      title: t('alert.leave-page'),
      message: t('alert.leave-page.message'),
      confirmLabel: t('common.leave'),
      cancelLabel: t('alert.leave-page.stay')
    })

    return response
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
    active_card_index,
    selected_card_indices,
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
    setMode,
    resetCards,
    saveCards,
    resetEdits,
    warnIfDirty
  }
}
