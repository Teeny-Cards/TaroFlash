<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UiInput from '@/components/ui-kit/input.vue'
import UiToggle from '@/components/ui-kit/toggle.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import coverDesigner from './cover-designer/index.vue'

const { t } = useI18n()
const { deck } = defineProps<{ imageUrl?: string; deck?: Deck }>()

const emit = defineEmits<{
  (e: 'image-uploaded', file: File): void
  (e: 'image-removed'): void
}>()

const title = defineModel<string>('title')
const description = defineModel<string>('description')
const isPublic = defineModel<boolean>('is-public')
</script>

<template>
  <div class="w-full flex flex-col items-center gap-6 sm:flex-row sm:gap-9">
    <div class="relative flex w-min flex-col items-center pb-6">
      <cover-designer :cover-config="deck?.cover_config" />
    </div>

    <div class="w-full flex flex-col gap-5 items-start">
      <ui-input
        :placeholder="t('deck.title-placeholder')"
        text-align="center"
        size="lg"
        v-model:value="title"
      />
      <ui-input :placeholder="t('deck.description-placeholder')" v-model:value="description" />

      <ui-toggle v-model:checked="isPublic">
        <div class="flex items-center gap-2.5">
          <ui-icon src="public" />
          {{ t('deck.settings-modal.is-public') }}
        </div>
      </ui-toggle>
    </div>
  </div>
</template>
