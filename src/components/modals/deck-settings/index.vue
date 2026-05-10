<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import TabDesign from './tab-design/index.vue'
import TabDeckSettings from './tab-deck-settings/index.vue'
import TabStudy from './tab-study/index.vue'
import DeckPreview from './deck-preview.vue'
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

const active_tab = ref('')
const active_side = ref<CardSide>('cover')

const visible_side = computed(() => (active_tab.value === 'design' ? active_side.value : 'cover'))

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
    :parts="{ content: 'w-98 flex flex-col gap-10' }"
    v-model:active="active_tab"
    @close="close(false)"
  >
    <template #header-content>
      <div class="w-full">
        <h1 class="text-5xl text-white">{{ t('deck.settings-modal.title') }}</h1>
      </div>
    </template>

    <template #design>
      <tab-design :cover="cover" :card_attributes="card_attributes" :side="active_side" />
    </template>

    <template #deck-settings>
      <tab-deck-settings :settings="settings" :cover="cover" />
    </template>

    <template #study>
      <tab-study
        :card_count="deck?.card_count"
        v-model:shuffle="config.shuffle"
        x
        v-model:flip_cards="config.flip_cards"
        v-model:is_spaced="config.is_spaced"
        v-model:auto_play="config.auto_play"
        v-model:max_reviews_per_day="config.max_reviews_per_day"
        v-model:max_new_per_day="config.max_new_per_day"
      />
    </template>

    <template #overlay>
      <deck-preview
        :deck_id="deck?.id"
        :cover="cover"
        :card_attributes="card_attributes"
        :side="visible_side"
        @update:side="active_side = $event"
      />
    </template>

    <template #after>
      <ui-button data-theme="blue-500" size="xl" @click="onSave" full-width l>
        {{ deck ? t('deck.settings-modal.submit-edit') : t('deck.settings-modal.submit-create') }}
      </ui-button>
    </template>
  </tab-sheet>
</template>
