<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, reactive } from 'vue'
import NameImageConfig from './name-image-config.vue'
import AdditionalSettings from './additional-settings.vue'
import HeaderConfig from './header-config.vue'

const { t } = useI18n()

const { deck, close } = defineProps<{
  deck?: Deck
  close: (response?: boolean) => void
}>()

const emit = defineEmits<{
  (e: 'saved', deck: Deck): void
}>()

const settings = reactive<Deck>({
  title: deck?.title,
  description: deck?.description,
  is_public: deck?.is_public
})

function onSave() {
  emit('saved', settings)
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
        <name-image-config v-model:title="settings.title" />
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
      <ui-kit:button variant="muted" icon-left="close" @click="close" class="ring-brown-300 ring-7">
        {{ t('common.cancel') }}
      </ui-kit:button>
      <ui-kit:button icon-left="check" @click="onSave" class="ring-brown-300 ring-7">
        {{ t('common.create') }}
      </ui-kit:button>
    </div>
  </div>
</template>
