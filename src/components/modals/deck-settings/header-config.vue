<script setup lang="ts">
import UiButton from '@/components/ui-kit/button.vue'
import { useI18n } from 'vue-i18n'

export type DeckSettingsTab = 'general' | 'study'

const { selectedTab } = defineProps<{
  selectedTab: DeckSettingsTab
}>()

const emit = defineEmits<{
  (e: 'change-tab', tab: DeckSettingsTab): void
}>()

const { t } = useI18n()

const tabs: Array<{ key: DeckSettingsTab; icon: string; label: string }> = [
  { key: 'general', icon: 'edit', label: t('deck.settings-modal.tab.general') },
  { key: 'study', icon: 'school-cap', label: t('deck.settings-modal.tab.study') }
]
</script>

<template>
  <div data-testid="deck-settings__tabs" class="flex items-center gap-6">
    <ui-button
      v-for="tab in tabs"
      :key="tab.key"
      :icon-left="tab.icon"
      icon-only
      size="lg"
      rounded-full
      data-theme="brown-100"
      :variant="selectedTab === tab.key ? 'solid' : 'outline'"
      :sfx="{ click: 'ui.select' }"
      @click="emit('change-tab', tab.key)"
    >
      {{ tab.label }}
    </ui-button>
  </div>
</template>
