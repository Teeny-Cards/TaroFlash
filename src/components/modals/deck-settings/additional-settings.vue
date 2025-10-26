<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import UiInput from '@/components/ui-kit/input.vue'
import UiToggle from '@/components/ui-kit/toggle.vue'
import UiIcon from '@/components/ui-kit/icon.vue'

const { t } = useI18n()

const description = defineModel<string>('description')
const isPublic = defineModel<boolean>('is-public')
const isSpaced = defineModel<boolean>('is-spaced')
const autoPlay = defineModel<boolean>('auto-play')
const onlyNewCards = defineModel<boolean>('only-new-cards')
</script>

<template>
  <div class="flex w-95 flex-col gap-6">
    <ui-input :placeholder="t('deck.description-placeholder')" v-model:value="description" />

    <div class="flex flex-col gap-4">
      <ui-toggle v-model:checked="isPublic" expand>
        <div class="flex items-center gap-2.5">
          <ui-icon src="cable-car" />
          {{ t('deck.settings-modal.is-public') }}
        </div>
      </ui-toggle>

      <ui-toggle v-model:checked="isSpaced" expand>
        <div class="flex items-center gap-2.5">
          <ui-icon src="moon-stars" />
          {{ t('deck.settings-modal.is-spaced') }}
        </div>
      </ui-toggle>

      <ui-toggle v-model:checked="autoPlay" expand>
        <div class="flex items-center gap-2.5">
          <ui-icon src="bell" />
          {{ t('deck.settings-modal.auto-play') }}
        </div>
      </ui-toggle>

      <ui-toggle v-model:checked="onlyNewCards" expand>
        <div class="flex items-center gap-2.5">
          <ui-icon src="school-cap" />
          {{ t('deck.settings-modal.only-new-cards') }}
        </div>
      </ui-toggle>
    </div>
  </div>
</template>
