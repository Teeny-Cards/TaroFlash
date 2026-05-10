<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UiInput from '@/components/ui-kit/input.vue'
import UiToggle from '@/components/ui-kit/toggle.vue'
import UiIcon from '@/components/ui-kit/icon.vue'

type TabDeckSettingsProps = {
  settings: {
    title?: string
    description?: string
    is_public?: boolean
  }
  cover: DeckCover
}

defineProps<TabDeckSettingsProps>()

const { t } = useI18n()
</script>

<template>
  <div data-testid="tab-deck-settings" class="flex flex-col gap-5 items-start w-full">
    <ui-input
      :placeholder="t('deck.title-placeholder')"
      text-align="center"
      size="lg"
      v-model:value="settings.title"
    />
    <ui-input
      :placeholder="t('deck.description-placeholder')"
      v-model:value="settings.description"
    />

    <ui-toggle v-model:checked="settings.is_public">
      <div class="flex items-center gap-2.5">
        <ui-icon src="public" />
        {{ t('deck.settings-modal.is-public') }}
      </div>
    </ui-toggle>
  </div>
</template>
