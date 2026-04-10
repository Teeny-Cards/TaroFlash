<script setup lang="ts">
import UiToggle from '@/components/ui-kit/toggle.vue'
import { ref } from 'vue'

type Settings = {
  study_all_cards: boolean
  shuffle: boolean
  flip_cards: boolean
  card_limit: number | null
}

const { settings, total_cards } = defineProps<{ settings: Settings; total_cards: number }>()

const emit = defineEmits<{
  (e: 'change', settings: Settings): void
}>()

const study_all_cards = ref(settings.study_all_cards)
const shuffle = ref(settings.shuffle)
const flip_cards = ref(settings.flip_cards)
const card_limit = ref(settings.card_limit)

function emitChange() {
  emit('change', {
    study_all_cards: study_all_cards.value,
    shuffle: shuffle.value,
    flip_cards: flip_cards.value,
    card_limit: card_limit.value
  })
}

function stepLimit(dir: 1 | -1) {
  const current = card_limit.value ?? 0
  const next = current + dir
  card_limit.value = next <= 0 ? null : Math.min(next, total_cards)
  emitChange()
}
</script>

<template>
  <div data-testid="session-settings" class="w-full flex flex-col gap-3 px-4 py-1">
    <ui-toggle v-model:checked="study_all_cards" @update:checked="emitChange">{{
      $t('study.settings.study-all')
    }}</ui-toggle>

    <ui-toggle v-model:checked="shuffle" @update:checked="emitChange">{{
      $t('study.settings.shuffle')
    }}</ui-toggle>

    <ui-toggle v-model:checked="flip_cards" @update:checked="emitChange">{{
      $t('study.settings.flip')
    }}</ui-toggle>

    <div class="flex items-center justify-between">
      <span class="text-brown-700 dark:text-brown-300 text-sm">
        {{ $t('study.settings.card-limit') }}
      </span>
      <div class="flex items-center gap-2">
        <button
          data-testid="session-settings__limit-dec"
          class="w-7 h-7 rounded-full bg-brown-100 dark:bg-grey-900 flex items-center justify-center cursor-pointer hover:bg-brown-200 dark:hover:bg-grey-700 disabled:opacity-30 disabled:cursor-default text-brown-700 dark:text-brown-300"
          :disabled="card_limit === null"
          @click="stepLimit(-1)"
        >
          −
        </button>
        <span
          data-testid="session-settings__limit-value"
          class="w-10 text-center text-brown-700 dark:text-brown-300 text-sm"
        >
          {{ card_limit ?? $t('study.settings.all') }}
        </span>
        <button
          data-testid="session-settings__limit-inc"
          class="w-7 h-7 rounded-full bg-brown-100 dark:bg-grey-900 flex items-center justify-center cursor-pointer hover:bg-brown-200 dark:hover:bg-grey-700 disabled:opacity-30 disabled:cursor-default text-brown-700 dark:text-brown-300"
          :disabled="card_limit === total_cards"
          @click="stepLimit(1)"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>
