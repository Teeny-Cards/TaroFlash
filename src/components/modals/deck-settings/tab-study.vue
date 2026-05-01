<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UiToggle from '@/components/ui-kit/toggle.vue'
import UiIcon from '@/components/ui-kit/icon.vue'

const { t } = useI18n()

const shuffle = defineModel<boolean | undefined>('shuffle')
const flip_cards = defineModel<boolean | undefined>('flip_cards')
const is_spaced = defineModel<boolean | undefined>('is_spaced')
const auto_play = defineModel<boolean | undefined>('auto_play')
const max_reviews_per_day = defineModel<number | null | undefined>('max_reviews_per_day')
const max_new_per_day = defineModel<number | null | undefined>('max_new_per_day')

const REVIEW_LIMIT_PRESETS: Array<{ label: string; value: number | null }> = [
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
  { label: '200', value: 200 },
  { label: t('study.settings.all'), value: null }
]

const NEW_LIMIT_PRESETS: Array<{ label: string; value: number | null }> = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: t('study.settings.all'), value: null }
]
</script>

<template>
  <div class="flex w-95 flex-col gap-5">
    <ui-toggle v-model:checked="is_spaced">
      <div class="flex items-center gap-2.5">
        <ui-icon src="moon-stars" />
        {{ t('deck.settings-modal.study.is-spaced') }}
      </div>
    </ui-toggle>

    <ui-toggle v-model:checked="shuffle">
      <div class="flex items-center gap-2.5">
        <ui-icon src="reorder" />
        {{ t('deck.settings-modal.study.shuffle') }}
      </div>
    </ui-toggle>

    <ui-toggle v-model:checked="flip_cards">
      <div class="flex items-center gap-2.5">
        <ui-icon src="horizontal-align" />
        {{ t('deck.settings-modal.study.flip-cards') }}
      </div>
    </ui-toggle>

    <ui-toggle v-model:checked="auto_play">
      <div class="flex items-center gap-2.5">
        <ui-icon src="bell" />
        {{ t('deck.settings-modal.study.auto-play') }}
      </div>
    </ui-toggle>

    <div class="flex flex-col gap-2">
      <span class="text-sm font-medium text-brown-700">
        {{ t('deck.settings-modal.study.max-reviews-per-day') }}
      </span>
      <div class="flex gap-2">
        <button
          v-for="preset in REVIEW_LIMIT_PRESETS"
          :key="String(preset.value)"
          class="h-9 min-w-12 cursor-pointer rounded-4 px-3 text-sm font-medium transition-all duration-75"
          :class="
            max_reviews_per_day === preset.value
              ? 'bg-blue-500 text-brown-100'
              : 'bg-brown-100 text-brown-700 hover:bg-brown-200'
          "
          @click="max_reviews_per_day = preset.value"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-sm font-medium text-brown-700">
        {{ t('deck.settings-modal.study.max-new-per-day') }}
      </span>
      <div class="flex gap-2">
        <button
          v-for="preset in NEW_LIMIT_PRESETS"
          :key="String(preset.value)"
          class="h-9 min-w-12 cursor-pointer rounded-4 px-3 text-sm font-medium transition-all duration-75"
          :class="
            max_new_per_day === preset.value
              ? 'bg-blue-500 text-brown-100'
              : 'bg-brown-100 text-brown-700 hover:bg-brown-200'
          "
          @click="max_new_per_day = preset.value"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>
  </div>
</template>
