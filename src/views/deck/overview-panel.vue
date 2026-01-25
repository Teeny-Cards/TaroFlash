<script setup lang="ts">
import Card from '@/components/card/index.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useModal } from '@/composables/modal'
import deckSettings from '@/components/modals/deck-settings/index.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiButton from '@/components/ui-kit/button.vue'
import StudySession from '@/components/modals/study-session/index.vue'

const { deck } = defineProps<{ deck: Deck; imageUrl?: string }>()
const emit = defineEmits<{ (e: 'updated'): void }>()

const { t } = useI18n()
const modal = useModal()

const study_disabled = computed(() => {
  return deck.cards?.length === 0
})

async function onSettingsClicked() {
  const { response } = modal.open(deckSettings, {
    props: { deck },
    backdrop: true,
    openAudio: 'ui.etc_camera_reel',
    closeAudio: 'ui.card_drop'
  })

  if (await response) {
    emit('updated')
  }
}

function onStudyClicked() {
  modal.open(StudySession, {
    backdrop: true,
    props: {
      deck
    },
    openAudio: 'ui.double_pop_up',
    closeAudio: 'ui.double_pop_down'
  })
}
</script>

<template>
  <div
    data-testid="overview-panel"
    class="flex w-max flex-col items-center gap-6 md:flex-row md:items-end xl:flex-col
      xl:items-start"
  >
    <card size="lg" class="relative" :front_image_url="imageUrl"></card>

    <div class="flex flex-col items-center gap-2 md:items-start">
      <h1
        data-testid="overview-panel__title"
        class="text-brown-700 dark:text-brown-300 w-64 text-center text-5xl md:text-left"
      >
        {{ deck.title }}
      </h1>

      <h2
        data-testid="overview-panel__description"
        class="text-grey-500 dark:text-brown-500 w-64 text-center md:text-left"
      >
        {{ deck.description }}
      </h2>

      <div class="flex items-center gap-2 text-blue-500">
        <ui-icon src="user" />
        <h2>
          {{ deck.member?.display_name }}
        </h2>
      </div>

      <div class="flex items-center gap-2 text-blue-500">
        <ui-icon src="teeny-cards" class="w-5 h-5" />
        <h2 c>{{ deck.card_count ?? 0 }} cards in deck</h2>
      </div>

      <div class="flex items-center gap-2.5">
        <ui-button
          data-testid="overview-panel__study-button"
          icon-left="play"
          fancy-hover
          :disabled="study_disabled"
          @click="onStudyClicked"
        >
          {{ t('common.study') }}
        </ui-button>

        <ui-button
          data-testid="overview-panel__settings-button"
          icon-left="settings"
          theme="grey-400"
          icon-only
          @click="onSettingsClicked()"
        >
          {{ t('common.settings') }}
        </ui-button>
      </div>
    </div>
  </div>
</template>
