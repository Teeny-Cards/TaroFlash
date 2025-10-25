<script setup lang="ts">
import OverviewPanel from '@/components/views/deck-view/overview-panel.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
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
import ContextMenu from '@/components/views/deck-view/context-menu.vue'
import { uploadCardImage, deleteCardImage } from '@/api/files'
import { updateCard as upstreamUpdateCard, searchCardsInDeck } from '@/api/cards'

const { id: deck_id } = defineProps<{
  id: string
}>()

const { t } = useI18n()
const modal = useModal()
const alert = useAlert()
const audio = useAudio()

const image_url = ref<string | undefined>()
const deck = ref<Deck>()
const active_tab = ref(0)

const {
  edited_cards,
  active_card_index,
  selected_card_indices,
  mode,
  all_cards_selected,
  is_dirty,
  addCard,
  deleteCards,
  updateCard,
  toggleSelectCard,
  selectCard,
  toggleSelectAll,
  activateCard,
  deactivateCard,
  resetCards,
  saveCards,
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

onBeforeRouteLeave(async () => {
  return await warnIfDirty()
})

onUnmounted(() => {
  document.removeEventListener('keydown', onEsc)
})

function warnIfDirty(): Promise<any> {
  if (!is_dirty.value) return Promise.resolve(true)

  return alert.warn({
    title: t('alert.leave-page'),
    message: t('alert.leave-page.message'),
    confirmLabel: t('common.leave'),
    cancelLabel: t('alert.leave-page.stay'),
    confirmAudio: 'digi_powerdown'
  })
}

async function trySetMode(new_mode: 'edit' | 'view' | 'select', reset = true) {
  const res = warnIfDirty()

  if (await res) {
    setMode(new_mode, reset)
  }
}

async function onEsc(e: KeyboardEvent) {
  if (e.key !== 'Escape') return

  if (mode.value !== 'view' && (await warnIfDirty())) {
    cancelEdits()
  }
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

async function onSaveClicked() {
  await saveCards()
  await refetchDeck()
  trySetMode('view')
}

async function refetchDeck() {
  try {
    deck.value = await fetchDeck(Number(deck_id))
    image_url.value = useDeckEditor(deck.value).image_url.value
    resetCards(deck.value.cards)
  } catch (e: any) {
    // TODO
  }
}

async function searchCards(query: string) {
  try {
    const cards = await searchCardsInDeck(Number(deck_id), query)
    resetCards(cards)
  } catch (e: any) {
    // TODO
  }
}

function cancelEdits() {
  trySetMode('view')
  audio.play('digi_powerdown')
}

async function onDeleteCards(index?: number) {
  const count = selected_card_indices.value.length + (index !== undefined ? 1 : 0)

  const did_confirm = await alert.warn({
    title: t('alert.delete-card', { count }),
    message: t('alert.delete-card.message', { count }),
    confirmLabel: t('common.delete'),
    confirmAudio: 'trash_crumple_short'
  })

  if (did_confirm) {
    if (index !== undefined) selectCard(index)

    await deleteCards()
    await refetchDeck()
  }
}

function onSelectCard(index: number) {
  toggleSelectCard(index)
  trySetMode('select', false)
}

function onCardActivated(index: number) {
  if (mode.value === 'view') {
    trySetMode('edit')
    audio.play('etc_camera_reel')
  }

  activateCard(index)
}

function onAddCard() {
  addCard()
  trySetMode('edit', false)
  activateCard(0)
}

async function updateCardImage(card_id: number, side: 'front' | 'back', file: File | undefined) {
  const card = deck.value?.cards?.find((card) => card.id === card_id)
  if (!card) return

  if (file) {
    try {
      await uploadCardImage(card_id, side, file)
      await upstreamUpdateCard({ ...card, [`has_${side}_image`]: true })
    } catch (e: any) {
      // TODO
    }
  } else {
    try {
      await deleteCardImage(card_id, side)
      await upstreamUpdateCard({ ...card, [`has_${side}_image`]: false })
    } catch (e: any) {
      // TODO
    }
  }
}
</script>

<template>
  <section data-testid="deck-view" class="flex h-full items-start gap-15">
    <overview-panel
      v-if="deck"
      class="sticky top-16"
      :deck="deck"
      :image-url="image_url"
      @study-clicked="onStudyClicked"
      @updated="refetchDeck()"
    />

    <div class="relative flex h-full w-full flex-col">
      <div class="sticky top-16 z-10 flex w-full justify-between pb-2">
        <ui-kit:tabs :tabs="tabs" v-model:activeTab="active_tab" storage-key="deck-view-tabs" />
        <ui-kit:input placeholder="Search" class="w-100" @input="searchCards"></ui-kit:input>
        <context-menu
          :mode="mode"
          :selectedCardIndices="selected_card_indices"
          :allCardsSelected="all_cards_selected"
          @new-card="onAddCard"
          @mode-changed="trySetMode"
          @save="onSaveClicked"
          @delete="onDeleteCards"
          @select-all="toggleSelectAll"
        />

        <div
          class="bg-brown-100 border-b-brown-500 absolute top-0 -right-3 bottom-0 -left-3 -z-10 border-b"
        ></div>
      </div>

      <component
        :is="tab_components[active_tab]"
        :mode="mode"
        :cards="edited_cards"
        :active-card-index="active_card_index"
        :selected-card-indices="selected_card_indices"
        @card-added="addCard"
        @card-updated="updateCard"
        @card-activated="onCardActivated"
        @card-deactivated="deactivateCard"
        @card-selected="onSelectCard"
        @card-deleted="onDeleteCards"
        @card-image-updated="updateCardImage"
      />
    </div>
  </section>
</template>
