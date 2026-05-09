<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TabDesign from './tab-design/index.vue'
import TabDeckSettings from './tab-deck-settings/index.vue'
import TabStudy from './tab-study/index.vue'
import { useDeckEditor } from '@/composables/deck-editor'
import UiButton from '@/components/ui-kit/button.vue'
import TabSheet from '@/components/layout-kit/modal/tab-sheet.vue'

export type DeckSettingsResponse = boolean

const { deck, close } = defineProps<{
  deck?: Deck
  close: (response?: DeckSettingsResponse) => void
}>()

const { t } = useI18n()
const { saveDeck, settings, config, cover, card_attributes } = useDeckEditor(deck)

const tabs = computed(() => [
  { value: 'deck-settings', icon: 'label', label: t('deck.settings-modal.tab.general') },
  { value: 'design', icon: 'design-services', label: t('deck.settings-modal.tab.design') },
  { value: 'study', icon: 'school-cap', label: t('deck.settings-modal.tab.study') }
])

async function onSave() {
  const saved = await saveDeck()
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
    @close="close(false)"
  >
    <template #design>
      <tab-design :deck_id="deck?.id" :cover="cover" :card_attributes="card_attributes" />
    </template>

    <template #deck-settings>
      <tab-deck-settings :settings="settings" />
    </template>

    <template #study>
      <tab-study
        :card_count="deck?.card_count"
        v-model:shuffle="config.shuffle"
        v-model:flip_cards="config.flip_cards"
        v-model:is_spaced="config.is_spaced"
        v-model:auto_play="config.auto_play"
        v-model:max_reviews_per_day="config.max_reviews_per_day"
        v-model:max_new_per_day="config.max_new_per_day"
      />
    </template>

    <template #after>
      <ui-button data-theme="blue-500" size="xl" @click="onSave" full-width>
        {{ deck ? t('deck.settings-modal.submit-edit') : t('deck.settings-modal.submit-create') }}
      </ui-button>
    </template>
  </tab-sheet>
</template>
