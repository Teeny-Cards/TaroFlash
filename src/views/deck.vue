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
import UiButton from '@/components/ui-kit/button.vue'
import SelectMenu from '@/components/views/deck-view/select-menu.vue'
import TextEditorToolbar from '@/components/views/deck-view/text-editor-toolbar/index.vue'
import { useShortcuts } from '@/composables/use-shortcuts'
import { type TextEditorUpdatePayload } from '@/components/text-editor.vue'

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
const is_saving = ref(false)

const { registerShortcut } = useShortcuts('deck-view')
const {
  all_cards,
  active_card_id,
  selected_card_ids,
  mode,
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
  setMode,
  clearSelectedCards
} = useCardBulkEditor(deck.value?.cards ?? [], Number(deck_id))

const tabs = [
  {
    label: t('deck-view.tabs.card-view'),
    icon: 'teeny-cards'
  },
  {
    label: t('deck-view.tabs.edit-cards'),
    icon: 'edit'
  }
]

const tab_components: { [key: number]: any } = {
  0: CardGrid,
  1: CardList
}

onMounted(async () => {
  await refetchDeck()

  registerShortcut({
    id: 'cancel-edit',
    combo: 'esc',
    description: 'Cancel Edit',
    handler: onEsc,
    when: () => mode.value === 'edit' || mode.value === 'select'
  })
})

async function onEsc() {
  setMode('view')
  deactivateCard()
  audio.play('card_drop')

  if (document.activeElement && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
}

function onStudy() {
  modal.open(StudySession, {
    backdrop: true,
    props: {
      deck: deck.value!
    },
    openAudio: 'double-pop-up',
    closeAudio: 'double-pop-down'
  })
}

async function onUpdateCard(id: number, side: 'front' | 'back', payload: TextEditorUpdatePayload) {
  is_saving.value = true

  try {
    const { text, delta } = payload
    await updateCard(id, { [`${side}_delta`]: delta, [`${side}_text`]: text })

    is_saving.value = false
  } catch (e: any) {
    toast.error(`${t('card.save-error')}: ${e.message}`)
  }
}

async function onCancel() {
  audio.play('card_drop')

  setMode('view')
  deactivateCard()
  clearSelectedCards()

  await refetchDeck()
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

  const { response: did_confirm } = alert.warn({
    title: t('alert.delete-card', { count }),
    message: t('alert.delete-card.message', { count }),
    confirmLabel: t('common.delete'),
    confirmAudio: 'trash_crumple_short'
  })

  if (await did_confirm) {
    if (id !== undefined) selectCard(id)

    await deleteCards()
    await refetchDeck()
    setMode('view')
  }
}

function onSelectCard(id: number) {
  toggleSelectCard(id)
  deactivateCard()
  setMode('select')
  audio.play('etc_camera_shutter')
}

function onToggleSelectAll() {
  toggleSelectAll()
  audio.play('etc_camera_shutter')
}

function onCardActivated(id: number) {
  activateCard(id)
  audio.play('slide_up')

  if (mode.value !== 'edit') {
    setMode('edit')
  }
}

async function onCardDeactivated() {
  setMode('view')
  deactivateCard()

  await new Promise((resolve) => setTimeout(resolve, 10))

  if (mode.value !== 'edit') {
    audio.play('card_drop')
  }
}

function onAddCard() {
  try {
    addCard()
    setMode('edit')
    audio.play('slide_up')
  } catch (e: any) {
    toast.error(t('toast.error.add-card'))
  }
}

function onSelect() {
  setMode('select')
  audio.play('etc_camera_shutter')
  deactivateCard()
}

async function onMoveCards(id?: number) {
  if (id !== undefined) selectCard(id)

  const selected_cards = getSelectedCards()

  const { response } = modal.open<MoveCardsModalResponse>(MoveCardsModal, {
    backdrop: true,
    props: {
      cards: selected_cards,
      current_deck_id: Number(deck_id)
    },
    openAudio: 'double-pop-up',
    closeAudio: 'double-pop-down'
  })

  const res = await response

  if (res === false && id !== undefined) {
    deselectCard(id)
    return
  }

  if (typeof res === 'object') {
    await moveCardsToDeck(selected_cards, res.deck_id)
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
  <section
    data-testid="deck-view"
    class="flex h-full flex-col lg:flex-row items-center md:items-start gap-15 pb-24"
  >
    <overview-panel
      v-if="deck"
      class="lg:sticky top-(--nav-height)"
      :deck="deck"
      :image-url="image_url"
      @study-clicked="onStudy"
      @updated="refetchDeck()"
    />

    <div class="relative flex h-full w-full flex-col">
      <div class="sticky top-(--nav-height) z-10 flex w-full justify-between pb-2">
        <ui-tabs :tabs="tabs" v-model:activeTab="active_tab" storage-key="deck-view-tabs" />

        <div class="flex items-center gap-4 text-brown-700">
          <p v-if="is_saving">Saving...</p>
          <p v-else>Saved</p>

          <ui-split-button theme="purple" v-if="mode === 'view' || mode === 'edit'">
            <template #defaults="{ option }">
              <component :is="option" icon="check" @click="onSelect">
                {{ t('deck-view.toggle-options.select') }}
              </component>
            </template>
          </ui-split-button>

          <ui-button v-if="mode === 'select'" @click="onCancel" icon-left="close" theme="grey">
            {{ t('common.cancel') }}
          </ui-button>
        </div>

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
        @card-updated="onUpdateCard"
        @card-activated="onCardActivated"
        @card-deactivated="onCardDeactivated"
        @card-selected="onSelectCard"
        @card-deleted="onDeleteCards"
        @card-moved="onMoveCards"
        @card-image-updated="updateCardImage"
      >
        <select-menu
          :open="mode === 'select'"
          :all-cards-selected="selected_card_ids.length === all_cards.length"
          :selected-card-count="selected_card_ids.length"
          @cancel="onCancel"
          @toggle-all="onToggleSelectAll"
          @move="onMoveCards"
          @delete="onDeleteCards"
        />

        <text-editor-toolbar
          class="fixed bottom-6 bg-white rounded-6 shadow-cutout p-3 pr-6 flex justify-center items-center gap-4
            transition-transform duration-100 ease-in-out outline outline-brown-900"
          inactive_classes="transform translate-y-20"
        />
      </component>
    </div>
  </section>
</template>
