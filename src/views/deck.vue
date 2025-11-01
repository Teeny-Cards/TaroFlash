<script setup lang="ts">
import OverviewPanel from '@/components/views/deck-view/overview-panel.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { fetchDeck } from '@/api/decks'
import StudySession from '@/components/modals/study-session/index.vue'
import CardList from '@/components/views/deck-view/card-list/index.vue'
import CardGrid from '@/components/views/deck-view/card-grid/index.vue'
import { useI18n } from 'vue-i18n'
import { useCardBulkEditor } from '@/composables/card-bulk-editor'
import { useAlert } from '@/composables/alert'
import { useModal } from '@/composables/modal'
import { useDeckEditor } from '@/composables/deck-editor'
import { useAudio } from '@/composables/audio'
import UiSplitButton from '@/components/ui-kit/split-button/index.vue'
import { uploadCardImage, deleteCardImage } from '@/api/files'
import { upsertCard, moveCardsToDeck, searchCardsInDeck } from '@/api/cards'
import MoveCardsModal, { type MoveCardsModalResponse } from '@/components/modals/move-cards.vue'
import UiTabs from '@/components/ui-kit/tabs.vue'
import { useToast } from '@/composables/toast'
import UiInput from '@/components/ui-kit/input.vue'

const { id: deck_id } = defineProps<{
  id: string
}>()

const { t } = useI18n()
const modal = useModal()
const alert = useAlert()
const audio = useAudio()
const toast = useToast()

const image_url = ref<string | undefined>()
const deck = ref<Deck>()
const active_tab = ref(0)

const {
  all_cards,
  active_card_id,
  selected_card_ids,
  mode,
  all_cards_selected,
  addCard,
  deleteCards,
  updateCard,
  toggleSelectCard,
  selectCard,
  deselectCard,
  toggleSelectAll,
  activateCard,
  deactivateCard,
  getSelectedCards,
  resetCards,
  setMode
} = useCardBulkEditor(deck.value?.cards ?? [], Number(deck_id))

const tabs = [
  {
    label: t('deck-view.tabs.list-view'),
    icon: 'list'
  },
  {
    label: t('deck-view.tabs.card-view'),
    icon: 'teeny-cards'
  }
]

const tab_components: { [key: number]: any } = {
  0: CardList,
  1: CardGrid
}

onMounted(async () => {
  await refetchDeck()
  document.addEventListener('keydown', onEsc)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onEsc)
})

async function onEsc(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  setMode('view')
  deactivateCard()
  audio.play('card_drop')
}

function onStudyClicked() {
  modal.open(StudySession, {
    backdrop: true,
    props: {
      deck: deck.value!
    },
    openAudio: 'double-pop-up',
    closeAudio: 'double-pop-down'
  })
}

async function onDoneClicked() {
  await refetchDeck()
  setMode('view')
}

async function refetchDeck() {
  try {
    deck.value = await fetchDeck(Number(deck_id))
    image_url.value = useDeckEditor(deck.value).image_url.value

    if (deck.value.cards) {
      resetCards(deck.value.cards)
    }
  } catch (e: any) {
    // TODO
  }
}

async function onDeleteCards(id?: number) {
  const count = selected_card_ids.value.length + (id !== undefined ? 1 : 0)

  const did_confirm = await alert.warn({
    title: t('alert.delete-card', { count }),
    message: t('alert.delete-card.message', { count }),
    confirmLabel: t('common.delete'),
    confirmAudio: 'trash_crumple_short'
  })

  if (did_confirm) {
    if (id !== undefined) selectCard(id)

    await deleteCards()
    await refetchDeck()
    setMode('view')
  }
}

function onSelectCard(id: number) {
  toggleSelectCard(id)
  setMode('select')
}

function onCardActivated(id: number) {
  activateCard(id)

  if (mode.value !== 'edit' && mode.value !== 'edit-one') {
    setMode('edit-one')
  }
}

function onCardClosed() {
  setMode('view')
  deactivateCard()
}

function onAddCard() {
  addCard()
  setMode('edit-one')
}

async function onMoveCards(id?: number) {
  if (id !== undefined) selectCard(id)

  const selected_cards = getSelectedCards()

  const response = await modal.open<MoveCardsModalResponse>(MoveCardsModal, {
    backdrop: true,
    props: {
      cards: selected_cards,
      current_deck_id: Number(deck_id)
    },
    openAudio: 'double-pop-up',
    closeAudio: 'double-pop-down'
  })

  if (response === false && id !== undefined) {
    deselectCard(id)
    return
  }

  if (typeof response === 'object') {
    await moveCardsToDeck(selected_cards, response.deck_id)
    await refetchDeck()
  }
}

async function updateCardImage(card_id: number, side: 'front' | 'back', file: File | undefined) {
  const card = deck.value?.cards?.find((card) => card.id === card_id)
  if (!card) return

  if (file) {
    try {
      await uploadCardImage(card_id, side, file)
      await upsertCard({ ...card, [`has_${side}_image`]: true })
    } catch (e: any) {
      // TODO
    }
  } else {
    try {
      await deleteCardImage(card_id, side)
      await upsertCard({ ...card, [`has_${side}_image`]: false })
    } catch (e: any) {
      // TODO
    }
  }
}

async function search(query?: string) {
  if (!deck.value?.id || query === undefined) return

  try {
    if (query.length > 0) {
      const cards = await searchCardsInDeck(deck.value.id, query)
      resetCards(cards)
    } else {
      await refetchDeck()
    }
  } catch (e: any) {
    // TODO
  }
}
</script>

<template>
  <section data-testid="deck-view" class="flex h-full items-start gap-15 pb-24">
    <overview-panel
      v-if="deck"
      class="sticky top-(--nav-height)"
      :deck="deck"
      :image-url="image_url"
      @study-clicked="onStudyClicked"
      @updated="refetchDeck()"
    />

    <div class="relative flex h-full w-full flex-col">
      <div class="sticky top-(--nav-height) z-10 flex w-full justify-between pb-2">
        <ui-tabs :tabs="tabs" v-model:activeTab="active_tab" storage-key="deck-view-tabs" />
        <ui-input @input="search"></ui-input>
        <ui-split-button theme="purple">
          <template #defaults="{ option }">
            <component :is="option" icon="edit">Edit Cards</component>
            <component :is="option" icon="check">Select</component>
          </template>
        </ui-split-button>

        <div
          class="bg-brown-100 border-b-brown-500 absolute top-0 -right-3 bottom-0 -left-3 -z-10 border-b"
        ></div>
      </div>

      <component
        :is="tab_components[active_tab]"
        :mode="mode"
        :cards="all_cards"
        :active-card-id="active_card_id"
        :selected-card-ids="selected_card_ids"
        @card-added="onAddCard"
        @card-updated="updateCard"
        @card-activated="onCardActivated"
        @card-closed="onCardClosed"
        @card-selected="onSelectCard"
        @card-deleted="onDeleteCards"
        @card-moved="onMoveCards"
        @card-image-updated="updateCardImage"
      />
    </div>
  </section>
</template>
