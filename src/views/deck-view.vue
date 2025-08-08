<script setup lang="ts">
import OverviewPanel from '@/components/views/deck-view/overview-panel.vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { fetchDeck } from '@/services/deck-service'
import StudyModal from '@/components/modals/study-modal/index.vue'
import CardList from '@/components/views/deck-view/card-list/index.vue'
import CardGrid from '@/components/views/deck-view/card-grid.vue'
import { useI18n } from 'vue-i18n'
import { useCardEditor } from '@/composables/use-card-editor'
import { useAlert } from '@/composables/use-alert'
import { useModal } from '@/composables/use-modal'
import { useDeckEditor } from '@/composables/use-deck-editor'
import { useAudio } from '@/composables/use-audio'
import ContextMenu from '@/components/views/deck-view/context-menu.vue'

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
  setMode,
  warnIfDirty
} = useCardEditor(deck.value?.cards ?? [], Number(deck_id))

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

async function onEsc(e: KeyboardEvent) {
  if (e.key !== 'Escape') return

  if (mode.value !== 'view' && (await warnIfDirty())) {
    cancelEdits()
  }
}

function onStudyClicked() {
  modal.open(StudyModal, {
    props: {
      deck: deck.value!
    }
  })
}

async function onSaveClicked() {
  await saveCards()
  await refetchDeck()
  setMode('view')
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

function cancelEdits() {
  setMode('view')
  audio.play('digi_powerdown')
}

async function onDeleteCards(index?: number) {
  const count = selected_card_indices.value.length + (index !== undefined ? 1 : 0)

  const { response: confirmed } = alert.warn({
    title: t('alert.delete-card', { count }),
    message: t('alert.delete-card.message', { count }),
    confirmLabel: t('common.delete')
  })

  if (await confirmed) {
    if (index !== undefined) selectCard(index)

    await deleteCards()
    await refetchDeck()

    audio.play('trash_crumple_short')
  }
}

function onSelectCard(index: number) {
  toggleSelectCard(index)
  setMode('select', false)
}

function onCardActivated(index: number) {
  if (mode.value === 'view') {
    setMode('edit')
    audio.play('etc_camera_reel')
  }

  activateCard(index)
}

function onAddCard() {
  addCard()
  setMode('edit', false)
  activateCard(0)
}
</script>

<template>
  <section data-testid="deck-view" class="flex h-full items-start gap-15">
    <overview-panel
      v-if="deck"
      class="sticky top-23"
      :deck="deck"
      :image-url="image_url"
      @study-clicked="onStudyClicked"
      @updated="refetchDeck()"
    />

    <div class="relative flex h-full w-full flex-col">
      <div class="sticky top-17 z-10 flex w-full justify-between py-6">
        <ui-kit:tabs :tabs="tabs" v-model:activeTab="active_tab" storage-key="deck-view-tabs" />

        <context-menu
          :mode="mode"
          :selectedCardIndices="selected_card_indices"
          :allCardsSelected="all_cards_selected"
          @new-card="onAddCard"
          @mode-changed="setMode"
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
      />
    </div>
  </section>
</template>
