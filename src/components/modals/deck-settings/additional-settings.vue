<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const description = defineModel<string>('description')
const isPublic = defineModel<boolean>('is-public')
const isSpaced = defineModel<boolean>('is-spaced')
const autoPlay = defineModel<boolean>('auto-play')
const onlyNewCards = defineModel<boolean>('only-new-cards')
</script>

<template>
  <div class="flex w-95 flex-col gap-6">
    <ui-kit:input :placeholder="t('deck.description-placeholder')" v-model:value="description" />

    <div class="flex flex-col gap-4">
      <ui-kit:toggle v-model:checked="isPublic" expand>
        <div class="flex items-center gap-2.5">
          <ui-kit:icon src="cable-car" />
          {{ t('deck.settings-modal.is-public') }}
        </div>
      </ui-kit:toggle>

      <ui-kit:toggle v-model:checked="isSpaced" expand>
        <div class="flex items-center gap-2.5">
          <ui-kit:icon src="moon-stars" />
          {{ t('deck.settings-modal.is-spaced') }}
        </div>
      </ui-kit:toggle>

      <ui-kit:toggle v-model:checked="autoPlay" expand>
        <div class="flex items-center gap-2.5">
          <ui-kit:icon src="bell" />
          {{ t('deck.settings-modal.auto-play') }}
        </div>
      </ui-kit:toggle>

      <ui-kit:toggle v-model:checked="onlyNewCards" expand>
        <div class="flex items-center gap-2.5">
          <ui-kit:icon src="school-cap" />
          {{ t('deck.settings-modal.only-new-cards') }}
        </div>
      </ui-kit:toggle>
    </div>
  </div>
</template>
