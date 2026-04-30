<script setup lang="ts">
import Deck from '@/components/deck.vue'
import { useI18n } from 'vue-i18n'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiButton from '@/components/ui-kit/button.vue'
import { useStudyModal } from '@/composables/modals/use-study-modal'
import { useDeckSettingsModal } from '@/composables/modals/use-deck-settings-modal'
import { inject } from 'vue'
import { type CardListController } from '@/composables/card-editor/card-list-controller'

const { deck } = defineProps<{ deck: Deck; imageUrl?: string }>()

const { t } = useI18n()
const study_session = useStudyModal()
const deck_settings_modal = useDeckSettingsModal()

const editor = inject<CardListController | null>('card-editor', null)
const mode = editor?.mode

function onStudyClicked() {
  study_session.start(deck)
}

function onSettingsClicked() {
  deck_settings_modal.open(deck)
}

function onToggleEditCards() {
  if (!editor) return
  editor.setMode(editor.mode.value === 'edit' ? 'view' : 'edit')
}
</script>

<template>
  <div
    data-testid="deck-hero"
    class="flex w-max flex-col items-center gap-6 md:flex-row md:items-end xl:flex-col xl:items-start"
  >
    <deck size="lg" class="relative" :deck="deck">
      <template #actions>
        <ui-button
          data-testid="deck-hero__settings-button"
          data-theme="blue-500"
          data-theme-dark="blue-650"
          icon-left="build"
          class="absolute! -top-2.5 -left-2.5"
          icon-only
          @click="onSettingsClicked"
          >{{ t('deck.settings-modal.title') }}</ui-button
        >
      </template>
    </deck>

    <div data-testid="deck-hero__details" class="flex flex-col items-center gap-2 md:items-start">
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
    </div>

    <div data-testid="deck-hero__actions" class="w-full flex flex-col gap-2">
      <ui-button
        data-testid="overview-panel__study-button"
        data-theme="blue-500"
        data-theme-dark="blue-650"
        full-width
        size="xl"
        @click="onStudyClicked"
      >
        <div class="text-brown-100">
          {{ t('common.study') }}
          <span
            class="bg-brown-100 dark:text-blue-650 text-blue-500 px-1 py-0.5 -rotate-5 rounded-1.5"
          >
            {{ deck.due_count }}
          </span>
          {{ t('common.cards') }}
        </div>
      </ui-button>

      <ui-button
        data-testid="overview-panel__settings-button"
        :icon-left="mode === 'edit' ? 'stop' : 'edit'"
        :data-theme="mode === 'edit' ? 'yellow-500' : 'brown-300'"
        :data-theme-dark="mode === 'edit' ? 'yellow-700' : 'stone-700'"
        full-width
        size="xl"
        @click="onToggleEditCards"
        v-sfx.click="'ui.select'"
      >
        {{ mode === 'edit' ? t('deck-view.actions.cancel') : t('deck-view.actions.edit-cards') }}
      </ui-button>
    </div>
  </div>
</template>
