<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import HeaderConfig, { type DeckSettingsTab } from './header-config.vue'
import TabGeneral from './tab-general.vue'
import TabStudy from './tab-study.vue'
import { useDeckEditor } from '@/composables/deck-editor'
import UiButton from '@/components/ui-kit/button.vue'
import MobileSheet from '@/components/layout-kit/modal/mobile-sheet.vue'

export type DeckSettingsResponse = boolean

const { deck, close } = defineProps<{
  deck?: Deck
  close: (response?: DeckSettingsResponse) => void
}>()

const { t } = useI18n()
const { saveDeck } = useDeckEditor(deck)

const tab = ref<DeckSettingsTab>('general')

async function onSave() {
  await saveDeck()
  close(true)
}
</script>

<template>
  <mobile-sheet
    data-testid="deck-settings-container"
    fill-height
    title="Deck Settings"
    @close="close(false)"
  >
    <template #after-header>
      <header-config :selected-tab="tab" @change-tab="tab = $event" />
    </template>

    <template #body>
      <tab-general v-if="tab === 'general'" :deck="deck" />
      <tab-study v-else-if="tab === 'study'" />
    </template>

    <template #footer>
      <ui-button class="sm:ring-brown-300 sm:ring-7" size="xl" @click="onSave" full-width>
        {{ deck ? t('common.save') : t('common.create') }}
      </ui-button>
    </template>
  </mobile-sheet>
</template>
