import { computed, ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAlert } from '@/composables/alert'
import { useModal } from '@/composables/modal'
import { useInfiniteScroll } from '@/composables/use-infinite-scroll'
import { emitSfx } from '@/sfx/bus'
import { useCardsInDeckInfiniteQuery, useDeckCardIdsQuery } from '@/api/cards'
import type { useDeckQuery } from '@/api/decks'
import MoveCardsModal from '@/components/modals/move-cards.vue'
import { useVirtualCardList } from './virtual-card-list'
import { useCardSelection } from './card-selection'
import { useCardMutations } from './card-mutations'

export type CardEditorMode = 'view' | 'select' | 'edit'
export type CardListController = ReturnType<typeof useCardListController>

type Options = {
  deck_id: number
  deck_query: ReturnType<typeof useDeckQuery>
}

export function useCardListController(opts: Options) {
  const deck_id = ref<number | undefined>(opts.deck_id)

  const cards_query = useCardsInDeckInfiniteQuery(() => opts.deck_id)
  const ids_query = useDeckCardIdsQuery(() => opts.deck_id)

  const list = useVirtualCardList(cards_query, deck_id)
  const selection = useCardSelection(ids_query)
  const mutations = useCardMutations({ list, deck_id })

  const card_attributes = computed<DeckCardAttributes>(() => ({
    front: opts.deck_query.data.value?.card_attributes?.front ?? {},
    back: opts.deck_query.data.value?.card_attributes?.back ?? {}
  }))

  const { t } = useI18n()
  const modal = useModal()
  const alert = useAlert()

  const mode = ref<CardEditorMode>('view')

  function setMode(new_mode: CardEditorMode) {
    mode.value = new_mode
  }

  function observeSentinel(sentinel: Ref<HTMLElement | null>) {
    useInfiniteScroll(sentinel, () => cards_query.loadNextPage(), {
      enabled: () => cards_query.hasNextPage.value && !cards_query.isLoading.value
    })
  }

  // Loaded persisted cards that the current selection covers, review stripped
  // for safe write payloads. In select-all mode this is incomplete by design;
  // that path uses `deleteCards({ except_ids })` instead.
  function loadedSelectedCards(): Card[] {
    return selection
      .filterSelected(list.persisted_cards.value)
      .map(({ review: _review, ...rest }) => rest as Card)
  }

  // Builds the card set for a row-level action: existing selection union the
  // explicit id, deduped. Does not mutate selection state.
  function collectCards(id: number | undefined): Card[] {
    const selected = loadedSelectedCards()
    if (id === undefined) return selected
    if (selection.isCardSelected(id)) return selected
    const card = list.findCard(id)
    if (!card) return selected
    const { review: _review, ...clean } = card
    return [...selected, clean as Card]
  }

  async function onCancel() {
    emitSfx('ui.card_drop')
    setMode('view')
    selection.clearSelectedCards()
    await opts.deck_query.refetch()
  }

  async function onDeleteCards(id?: number) {
    if (selection.select_all_mode.value) {
      const count = selection.selected_count.value
      const { response: did_confirm } = alert.warn({
        title: t('alert.delete-card', { count }),
        message: t('alert.delete-card.message', { count }),
        confirmLabel: t('common.delete'),
        confirmAudio: 'ui.trash_crumple_short'
      })
      if (await did_confirm) {
        await mutations.deleteCards({ except_ids: selection.deselected_ids.value.slice() })
        selection.clearSelectedCards()
        await opts.deck_query.refetch()
        setMode('view')
      }
      return
    }

    const cards = collectCards(id)
    if (cards.length === 0) return

    const count = cards.length
    const { response: did_confirm } = alert.warn({
      title: t('alert.delete-card', { count }),
      message: t('alert.delete-card.message', { count }),
      confirmLabel: t('common.delete'),
      confirmAudio: 'ui.trash_crumple_short'
    })
    if (await did_confirm) {
      await mutations.deleteCards({ cards })
      selection.clearSelectedCards()
      await opts.deck_query.refetch()
      setMode('view')
    }
  }

  function onSelectCard(id?: number) {
    if (id !== undefined) selection.toggleSelectCard(id)
    setMode('select')
    emitSfx('ui.etc_camera_shutter')
  }

  async function onMoveCards(id?: number) {
    const cards = collectCards(id)
    if (cards.length === 0) return

    emitSfx('ui.double_pop_up')
    const { response } = modal.open<{ deck_id: number }>(MoveCardsModal, {
      backdrop: true,
      props: { cards, current_deck_id: opts.deck_id }
    })
    response.then(() => emitSfx('ui.double_pop_down'))

    const res = await response
    if (res) {
      await mutations.moveCards({ cards, target_deck_id: res.deck_id })
    }
  }

  return {
    all_cards: list.all_cards,
    getKey: list.getKey,
    addCard: list.addCard,
    appendCard: list.appendCard,
    prependCard: list.prependCard,

    isCardSelected: selection.isCardSelected,
    selectCard: selection.selectCard,
    deselectCard: selection.deselectCard,
    toggleSelectCard: selection.toggleSelectCard,
    selectAllCards: selection.selectAllCards,
    clearSelectedCards: selection.clearSelectedCards,
    toggleSelectAll: selection.toggleSelectAll,
    selected_card_ids: selection.selected_card_ids,
    deselected_ids: selection.deselected_ids,
    select_all_mode: selection.select_all_mode,
    selected_count: selection.selected_count,
    all_cards_selected: selection.all_cards_selected,
    total_card_count: selection.total_card_count,

    saving: mutations.saving,
    updateCard: mutations.updateCard,

    card_attributes,
    deck_id,

    mode,
    setMode,

    hasNextPage: cards_query.hasNextPage,
    isLoading: cards_query.isLoading,
    observeSentinel,

    onCancel,
    onDeleteCards,
    onSelectCard,
    onMoveCards
  }
}
