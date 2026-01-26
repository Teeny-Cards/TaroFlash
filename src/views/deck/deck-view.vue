<script setup lang="ts">
import OverviewPanel from '@/views/deck/overview-panel.vue'
import { onMounted, ref, provide } from 'vue'
import { fetchDeck } from '@/api/decks'
import CardEditor from './card-editor/index.vue'
import CardGrid from './card-grid/index.vue'
import { useI18n } from 'vue-i18n'
import { useCardBulkEditor } from '@/composables/card-bulk-editor'
import { useAlert } from '@/composables/alert'
import { useModal } from '@/composables/modal'
import { emitSfx } from '@/sfx/bus'
import UiSplitButton from '@/components/ui-kit/split-button/index.vue'
import UiScrollBar from '@/components/ui-kit/scroll-bar.vue'
import { moveCardsToDeck } from '@/api/cards'
import MoveCardsModal, { type MoveCardsModalResponse } from '@/components/modals/move-cards.vue'
import UiTabs from '@/components/ui-kit/tabs.vue'
import UiButton from '@/components/ui-kit/button.vue'
import BulkSelectToolbar from '@/views/deck/bulk-select-toolbar.vue'
import { useMediaQuery } from '@/composables/use-media-query'

const { id: deck_id } = defineProps<{
  id: string
}>()

const { t } = useI18n()
const modal = useModal()
const alert = useAlert()
const is_md = useMediaQuery('md')

const image_url = ref<string | undefined>()
const deck = ref<Deck>()
const active_tab = ref(0)

const editor = useCardBulkEditor(deck.value?.cards ?? [], Number(deck_id))

provide('card-editor', editor)
provide('on-delete-card', onDeleteCards)
provide('on-move-card', onMoveCards)
provide('on-select-card', onSelectCard)

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
  1: CardEditor
}

onMounted(async () => {
  await refetchDeck()
})

async function onCancel() {
  emitSfx('ui.card_drop')

  editor.setMode('view')
  editor.clearSelectedCards()

  await refetchDeck()
}

async function refetchDeck() {
  try {
    deck.value = await fetchDeck(Number(deck_id))

    if (deck.value.cards) {
      editor.resetCards(deck.value.cards)
    }
  } catch (e: any) {
    // TODO
  }
}

async function onDeleteCards(id?: number) {
  const count = editor.selected_card_ids.value.length + (id !== undefined ? 1 : 0)

  const { response: did_confirm } = alert.warn({
    title: t('alert.delete-card', { count }),
    message: t('alert.delete-card.message', { count }),
    confirmLabel: t('common.delete'),
    confirmAudio: 'ui.trash_crumple_short'
  })

  if (await did_confirm) {
    if (id !== undefined) editor.selectCard(id)

    await editor.deleteCards()
    await refetchDeck()
    editor.setMode('view')
  }
}

function onSelectCard(id?: number) {
  if (id !== undefined) editor.selectCard(id)

  editor.setMode('select')
  emitSfx('ui.etc_camera_shutter')
}

async function onMoveCards(id?: number) {
  if (id === undefined) {
    return
  }

  editor.selectCard(id)
  const selected_cards = editor.getSelectedCards()

  const { response } = modal.open<MoveCardsModalResponse>(MoveCardsModal, {
    backdrop: true,
    props: {
      cards: selected_cards,
      current_deck_id: Number(deck_id)
    },
    openAudio: 'ui.double_pop_up',
    closeAudio: 'ui.double_pop_down'
  })

  const res = await response

  if (res) {
    await moveCardsToDeck(selected_cards, res.deck_id)
    await refetchDeck()
  } else {
    editor.deselectCard(id)
  }
}
</script>

<template>
  <section
    data-testid="deck-view"
    class="flex h-full flex-col xl:flex-row items-center xl:items-start gap-6 md:gap-15 pb-24"
  >
    <overview-panel
      v-if="deck"
      class="xl:sticky top-(--nav-height)"
      :deck="deck"
      :image-url="image_url"
      @updated="refetchDeck()"
    />

    <div class="relative flex h-full w-full flex-col items-center">
      <div
        data-testid="deck-view__action-bar"
        class="sticky top-(--nav-height) hidden z-10 md:flex max-w-208 w-full xl:max-w-full
          justify-between pb-2"
      >
        <ui-tabs :tabs="tabs" v-model:activeTab="active_tab" storage-key="deck-view-tabs" />

        <div class="flex items-center gap-4 text-brown-700 dark:text-brown-300">
          <p v-if="editor.saving.value">Saving...</p>
          <p v-else>Saved</p>

          <ui-split-button theme="purple-400" v-if="editor.mode.value === 'view'">
            <template #defaults="{ option }">
              <component :is="option" icon="check" @click="onSelectCard">
                {{ t('deck-view.toggle-options.select') }}
              </component>
            </template>
          </ui-split-button>

          <ui-button
            v-if="editor.mode.value === 'select'"
            @click="onCancel"
            icon-left="close"
            theme="grey-400"
          >
            {{ t('common.cancel') }}
          </ui-button>
        </div>

        <div
          class="bg-brown-100 dark:bg-grey-900 border-b-brown-500 absolute -top-10 right-0 left-0
            sm:-right-3 bottom-0 sm:-left-3 -z-10 border-b"
        ></div>
      </div>

      <component :is="is_md ? tab_components[active_tab] : CardGrid">
        <bulk-select-toolbar @cancel="onCancel" @move="onMoveCards" @delete="onDeleteCards" />
      </component>
    </div>

    <ui-scroll-bar target="html" />
  </section>
</template>
