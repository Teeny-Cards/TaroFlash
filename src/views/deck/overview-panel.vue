<script setup lang="ts">
import Deck from '@/components/deck.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDeckSettingsModal } from '@/composables/modals/use-deck-settings-modal'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiButton from '@/components/ui-kit/button.vue'
import { useStudyModal } from '@/composables/modals/use-study-modal'

const { deck } = defineProps<{ deck: Deck; imageUrl?: string }>()
const emit = defineEmits<{ (e: 'updated'): void }>()

const { t } = useI18n()
const deck_settings_modal = useDeckSettingsModal()
const study_session = useStudyModal()

const study_disabled = computed(() => {
  return deck.cards?.length === 0
})

async function onSettingsClicked() {
  const { response } = deck_settings_modal.open(deck)

  if (await response) {
    emit('updated')
  }
}

function onStudyClicked() {
  study_session.start(deck)
}
</script>

<template>
  <div
    data-testid="overview-panel"
    class="flex w-max flex-col items-center gap-6 md:flex-row md:items-end xl:flex-col xl:items-start"
  >
    <deck size="lg" class="relative" :deck="deck"></deck>

    <div class="flex flex-col items-center gap-2 md:items-start">
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
          theme="brown-300"
          icon-only
          @click="onSettingsClicked()"
        >
          {{ t('common.settings') }}
        </ui-button>
      </div>
    </div>
  </div>
</template>
