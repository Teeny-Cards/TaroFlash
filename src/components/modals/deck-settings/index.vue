<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import NameImageConfig from './name-image-config.vue'
import AdditionalSettings from './additional-settings.vue'
import HeaderConfig from './header-config.vue'
import { useAlert } from '@/composables/use-alert'
import { useDeck } from '@/composables/use-deck'
import { useAudio } from '@/composables/use-audio'
import { inject, onBeforeUnmount, onMounted } from 'vue'
import type { ModalContext } from '@/components/ui-kit/modal.vue'

const { deck, close } = defineProps<{
  deck?: Deck
  close: (response?: boolean) => void
}>()

let cleanupBackdropListener: () => void
const { registerBackdropCloseListener } = inject('modal-context') as ModalContext

const { t } = useI18n()
const alert = useAlert()
const audio = useAudio()
const { settings, image_url, saveDeck, deleteDeck, uploadImage, removeImage } = useDeck(deck)

onMounted(() => {
  audio.play('double-pop-up')

  cleanupBackdropListener = registerBackdropCloseListener(() => {
    audio.play('double-pop-down')
  })
})

onBeforeUnmount(() => {
  cleanupBackdropListener()
})

async function onSave() {
  await saveDeck()
  audio.play('double-pop-down')
  close(true)
}

function onClose() {
  audio.play('double-pop-down')
  close(false)
}

async function onDeleted() {
  const { response } = alert.warn({
    title: t('alert.delete-deck'),
    message: t('alert.delete-deck.message'),
    confirmLabel: t('common.delete')
  })

  if (await response) {
    await deleteDeck()
    audio.play('trash_crumple_short')
    close(true)
  }
}
</script>

<template>
  <div data-testid="deck-settings-container" class="relative">
    <div
      data-testid="deck-settings"
      class="rounded-10 bg-brown-300 shadow-modal flex flex-col overflow-hidden"
    >
      <header-config />

      <section data-testid="deck-settings__body" class="flex gap-9 p-12 pt-8">
        <name-image-config
          v-model:title="settings.title"
          :image-url="image_url"
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
      <ui-kit:button
        variant="muted"
        icon-left="close"
        @click="onClose"
        class="ring-brown-300 ring-7"
      >
        {{ t('common.cancel') }}
      </ui-kit:button>

      <ui-kit:button
        v-if="deck"
        icon-left="check"
        @click="onDeleted"
        variant="danger"
        class="ring-brown-300 ring-7"
      >
        {{ t('common.delete') }}
      </ui-kit:button>

      <ui-kit:button icon-left="check" @click="onSave" class="ring-brown-300 ring-7">
        {{ deck ? t('common.save') : t('common.create') }}
      </ui-kit:button>
    </div>
  </div>
</template>
