<script setup lang="ts">
import { computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import TabDesign from './tab-design/index.vue'
import TabDeckSettings from './tab-deck-settings/index.vue'
import TabStudy from './tab-study/index.vue'
import DeckPreview from './deck-preview.vue'
import { useDeckEditor, deckEditorKey } from '@/composables/deck-editor'
import { useSessionRef } from '@/composables/use-session-ref'
import UiButton from '@/components/ui-kit/button.vue'
import TabSheet from '@/components/layout-kit/modal/tab-sheet.vue'

export type DeckSettingsResponse = boolean

const { deck, close } = defineProps<{
  deck?: Deck
  close: (response?: DeckSettingsResponse) => void
}>()

const { t } = useI18n()

const editor = useDeckEditor(deck)
provide(deckEditorKey, editor)

const tabs = computed(() => [
  { value: 'deck-settings', icon: 'label', label: t('deck.settings-modal.tab.general') },
  { value: 'design', icon: 'design-services', label: t('deck.settings-modal.tab.design') },
  { value: 'study', icon: 'school-cap', label: t('deck.settings-modal.tab.study') }
])

const active_tab = useSessionRef('deck-settings.active-tab', '')

const visible_side = computed(() =>
  active_tab.value === 'design' ? editor.active_side.value : 'cover'
)

function onPreviewSide(side: CardSide) {
  if (active_tab.value !== 'design') return
  editor.setActiveSide(side)
}

async function onSave() {
  const saved = await editor.saveDeck()
  if (saved) close(true)
}
</script>

<template>
  <tab-sheet
    data-testid="deck-settings-container"
    data-theme="green-500"
    data-theme-dark="green-800"
    class="sm:w-245 sm:h-167"
    :title="t('deck.settings-modal.title')"
    :tabs="tabs"
    :cover_config="{ pattern: 'endless-clouds' }"
    :parts="{ content: 'w-98 flex flex-col gap-4' }"
    hover_sfx="ui.click_07"
    v-model:active="active_tab"
    @close="close(false)"
  >
    <tab-design v-if="active_tab === 'design'" />
    <tab-deck-settings v-else-if="active_tab === 'deck-settings'" />
    <tab-study v-else-if="active_tab === 'study'" />

    <template #overlay>
      <deck-preview
        :deck_id="deck?.id"
        :cover="editor.cover"
        :card_attributes="editor.card_attributes"
        :side="visible_side"
        @update:side="onPreviewSide"
      />
    </template>

    <template #footer>
      <ui-button
        data-theme="blue-500"
        data-theme-dark="blue-650"
        size="xl"
        full-width
        @click="onSave"
      >
        {{ deck ? t('deck.settings-modal.submit-edit') : t('deck.settings-modal.submit-create') }}
      </ui-button>
    </template>
  </tab-sheet>
</template>
