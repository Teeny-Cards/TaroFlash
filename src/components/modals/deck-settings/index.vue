<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import NameImageConfig from './name-image-config.vue'
import AdditionalSettings from './additional-settings.vue'
import HeaderConfig from './header-config.vue'
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
const { settings, saveDeck, deleteDeck, uploadImage, removeImage } = useDeckEditor(deck)

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
  <div data-testid="deck-settings-container" class="relative">
    <div
      data-testid="deck-settings"
      class="rounded-10 bg-brown-300 shadow-lg flex flex-col overflow-hidden"
    >
      <header-config />

      <section data-testid="deck-settings__body" class="flex gap-9 p-12 pt-8">
        <name-image-config
          v-model:title="settings.title"
          @image-uploaded="uploadImage"
          @image-removed="removeImage"
        />
        <additional-settings
          v-model:description="settings.description"
          v-model:is-public="settings.is_public"
        />
      </section>
    </div>

    <div
      data-testid="deck-settings__actions"
      class="absolute -bottom-2 flex w-full justify-end gap-3 px-10.5"
    >
      <ui-button theme="grey" icon-left="close" @click="close(false)" class="ring-brown-300 ring-7">
        {{ t('common.cancel') }}
      </ui-button>

      <ui-button
        v-if="deck"
        icon-left="check"
        @click="onDeleted"
        theme="red"
        class="ring-brown-300 ring-7"
      >
        {{ t('common.delete') }}
      </ui-button>

      <ui-button icon-left="check" @click="onSave" class="ring-brown-300 ring-7">
        {{ deck ? t('common.save') : t('common.create') }}
      </ui-button>
    </div>
  </div>
</template>
