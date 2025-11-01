<script setup lang="ts">
import Card from '@/components/card/index.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useModal } from '@/composables/modal'
import deckSettings from '@/components/modals/deck-settings/index.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiButton from '@/components/ui-kit/button.vue'

const { deck } = defineProps<{ deck: Deck; imageUrl?: string }>()
const emit = defineEmits<{ (e: 'study-clicked'): void; (e: 'updated'): void }>()

const { t } = useI18n()
const modal = useModal()

const study_disabled = computed(() => {
  return deck.cards?.length === 0
})

async function onSettingsClicked() {
  const did_update = await modal.open(deckSettings, {
    props: { deck },
    backdrop: true,
    openAudio: 'etc_camera_reel',
    closeAudio: 'card_drop'
  })

  if (await did_update) {
    emit('updated')
  }
}
</script>

<template>
  <div
    data-testid="overview-panel"
    class="flex w-max flex-col items-center gap-6 sm:flex-row sm:items-end lg:flex-col lg:items-start"
  >
    <card size="lg" class="relative" :front_image_url="imageUrl"></card>

    <div class="flex flex-col items-center gap-2 sm:items-start">
      <h1
        data-testid="overview-panel__title"
        class="text-brown-700 w-64 text-center text-5xl sm:text-left"
      >
        {{ deck.title }}
      </h1>

      <h2
        data-testid="overview-panel__description"
        class="text-grey-500 w-64 text-center sm:text-left"
      >
        {{ deck.description }}
      </h2>

      <div class="flex items-center gap-2 text-blue-500">
        <ui-icon src="user" />
        <h2 class="text-lg font-semibold">
          {{ deck.member?.display_name }}
        </h2>
      </div>

      <div class="flex items-center gap-2 text-blue-500">
        <ui-icon src="teeny-cards" />
        <h2 class="text-lg font-semibold">{{ deck.card_count ?? 0 }} cards in deck</h2>
      </div>
    </div>

    <div class="flex items-center gap-2.5">
      <ui-button
        data-testid="overview-panel__study-button"
        icon-left="play"
        fancy-hover
        :disabled="study_disabled"
        @click="$emit('study-clicked')"
      >
        {{ t('common.study') }}
      </ui-button>

      <ui-button
        data-testid="overview-panel__settings-button"
        icon-left="settings"
        variant="muted"
        icon-only
        @click="onSettingsClicked()"
      >
        {{ t('common.settings') }}
      </ui-button>
    </div>
  </div>
</template>
