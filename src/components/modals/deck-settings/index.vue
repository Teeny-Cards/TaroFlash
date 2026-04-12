<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import HeaderConfig, { type DeckSettingsTab } from './header-config.vue'
import TabGeneral from './tab-general.vue'
import TabCover from './tab-cover.vue'
import TabStudy from './tab-study.vue'
import { useAlert } from '@/composables/alert'
import { useDeckEditor } from '@/composables/deck-editor'
import UiButton from '@/components/ui-kit/button.vue'

export type DeckSettingsResponse = boolean

const { deck, close } = defineProps<{
  deck?: Deck
  close: (response?: DeckSettingsResponse) => void
}>()

const { t } = useI18n()
const alert = useAlert()
const { settings, config, cover, saveDeck, deleteDeck, uploadImage, removeImage } =
  useDeckEditor(deck)

const tab = ref<DeckSettingsTab>('general')

async function onSave() {
  await saveDeck()
  close(true)
}

async function onDeleted() {
  const { response: did_confirm } = alert.warn({
    title: t('alert.delete-deck'),
    message: t('alert.delete-deck.message'),
    confirmLabel: t('common.delete'),
    confirmAudio: 'ui.trash_crumple_short',
    cancelAudio: 'ui.digi_powerdown'
  })

  if (await did_confirm) {
    await deleteDeck()
    close(true)
  }
}
</script>

<template>
  <div data-testid="deck-settings-container" class="relative w-full h-full sm:w-auto">
    <div
      data-testid="deck-settings"
      class="bg-brown-300 shadow-lg flex flex-col justify-between overflow-hidden rounded-t-8 sm:rounded-b-10 h-full"
    >
      <header-config :selected-tab="tab" @change-tab="tab = $event" />

      <section data-testid="deck-settings__body" class="p-6 sm:p-12 sm:pt-8 h-full">
        <tab-general
          v-if="tab === 'general'"
          :deck="deck"
          :image-url="undefined"
          v-model:title="settings.title"
          v-model:description="settings.description"
          v-model:is-public="settings.is_public"
          @image-uploaded="uploadImage"
          @image-removed="removeImage"
        />

        <tab-cover
          v-else-if="tab === 'cover'"
          v-model:bg_color="cover.bg_color"
          v-model:border_color="cover.border_color"
          v-model:pattern="cover.pattern"
          v-model:pattern_color="cover.pattern_color"
        />

        <tab-study
          v-else-if="tab === 'study'"
          v-model:shuffle="config.shuffle"
          v-model:flip_cards="config.flip_cards"
          v-model:retry_failed_cards="config.retry_failed_cards"
          v-model:is_spaced="config.is_spaced"
          v-model:auto_play="config.auto_play"
          v-model:card_limit="config.card_limit"
        />
      </section>

      <div data-testid="deck-settings__actions" class="flex w-full justify-end gap-3 px-6 pb-6">
        <ui-button
          v-if="deck"
          icon-left="delete"
          theme="red-500"
          size="xl"
          class="sm:ring-brown-300 sm:ring-7"
          @click="onDeleted"
          full-width
        >
          {{ t('common.delete') }}
        </ui-button>

        <ui-button
          icon-left="check"
          class="sm:ring-brown-300 sm:ring-7"
          size="xl"
          @click="onSave"
          full-width
        >
          {{ deck ? t('common.save') : t('common.create') }}
        </ui-button>
      </div>
    </div>
  </div>
</template>
