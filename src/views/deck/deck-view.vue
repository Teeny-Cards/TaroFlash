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
import BulkSelectMenu from '@/views/deck/bulk-select-menu.vue'
import TextEditorToolbar from '@/components/text-editor-toolbar/index.vue'
import { useShortcuts } from '@/composables/use-shortcuts'

const { id: deck_id } = defineProps<{
  id: string
}>()

const { t } = useI18n()
const modal = useModal()
const alert = useAlert()

const image_url = ref<string | undefined>()
const deck = ref<Deck>()
const active_tab = ref(0)

const shortcuts = useShortcuts('deck-view')
const editor = useCardBulkEditor(deck.value?.cards ?? [], Number(deck_id))

provide('card-editor', editor)
provide('on-delete-card', onDeleteCards)
provide('on-move-card', onMoveCards)

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

shortcuts.register({
  combo: 'esc',
  handler: onEsc,
  when: () => editor.mode.value === 'select'
})

onMounted(async () => {
  await refetchDeck()
})

async function onEsc() {
  editor.setMode('view')
  emitSfx('ui.card_drop')

  if (document.activeElement && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur()
  }
}

async function onCancel() {
  emitSfx('ui.card_drop')

  editor.setMode('view')
  editor.clearSelectedCards()

  await refetchDeck()
}

async function refetchDeck() {
  try {
    deck.value = await fetchDeck(Number(deck_id))
    // image_url.value = useDeckEditor(deck.value).image_url.value

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

// function onSelectCard(id: number) {
//   toggleSelectCard(id)
//   deactivateCard()
//   setMode('select')
//   emitSfx('ui.etc_camera_shutter')
// }

// function onToggleSelectAll() {
//   toggleSelectAll()
//   emitSfx('ui.etc_camera_shutter')
// }

// function onCardActivated(id: number) {
//   activateCard(id)
//   emitSfx('ui.slide_up')
// }

// function onCardDeactivated() {
//   deactivateCard()

//   setTimeout(() => {
//     // gotta wait a second to make sure another card hasn't been activated
//     if (active_card_id.value === undefined) {
//       emitSfx('ui.card_drop')
//     }
//   }, 0)
// }

function onSelect() {
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
    class="flex h-full flex-col xl:flex-row items-center xl:items-start gap-15 pb-24"
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
        class="sticky top-(--nav-height) z-10 flex max-w-208 w-full xl:max-w-full justify-between
          pb-2"
      >
        <ui-tabs :tabs="tabs" v-model:activeTab="active_tab" storage-key="deck-view-tabs" />

        <div class="flex items-center gap-4 text-brown-700 dark:text-brown-300">
          <p v-if="editor.saving.value">Saving...</p>
          <p v-else>Saved</p>

          <ui-split-button theme="purple" v-if="editor.mode.value === 'view'">
            <template #defaults="{ option }">
              <component :is="option" icon="check" @click="onSelect">
                {{ t('deck-view.toggle-options.select') }}
              </component>
            </template>
          </ui-split-button>

          <ui-button
            v-if="editor.mode.value === 'select'"
            @click="onCancel"
            icon-left="close"
            theme="grey"
          >
            {{ t('common.cancel') }}
          </ui-button>
        </div>

        <div
          class="bg-brown-100 dark:bg-grey-900 border-b-brown-500 absolute -top-10 right-0 left-0
            sm:-right-3 bottom-0 sm:-left-3 -z-10 border-b"
        ></div>
      </div>

      <component :is="tab_components[active_tab]">
        <bulk-select-menu @cancel="onCancel" @move="onMoveCards" @delete="onDeleteCards" />
        <text-editor-toolbar inactive_classes="transform translate-y-25" hide_on_mobile />
      </component>
    </div>

    <ui-scroll-bar target="html" />
  </section>
</template>
