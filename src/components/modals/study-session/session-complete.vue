<script setup lang="ts">
import { computed } from 'vue'
import UiButton from '@/components/ui-kit/button.vue'
import { useI18n } from 'vue-i18n'

const { score, total, close } = defineProps<{
  score: number
  total: number
  close: () => void
}>()

const { t } = useI18n()

const percentage = computed(() => {
  if (!total) return 0
  return Math.round((score / total) * 100)
})

const heading = computed(() => {
  if (percentage.value === 100) return t('study-session.complete.perfect')
  if (percentage.value >= 80) return t('study-session.complete.great-job')
  if (percentage.value >= 60) return t('study-session.complete.nice-work')
  return t('study-session.complete.keep-it-up')
})
</script>

<template>
  <div
    class="bg-brown-300 dark:bg-grey-800 rounded-t-8 sm:rounded-b-8 shadow-2xl overflow-hidden w-full sm:max-w-100 h-full max-h-120 shadow-sm flex flex-col items-center justify-between"
    @click.stop
  >
    <div
      class="w-full bg-purple-500 wave-bottom-[50px] bgx-diagonal-stripes bgx-size-20 px-13 py-11.5 pb-14 text-center"
    >
      <h1 data-testid="session-complete__heading" class="text-white text-5xl">{{ heading }}</h1>
    </div>

    <div class="h-full w-full flex flex-col items-center justify-center gap-5 px-6 pb-6 -mt-2">
      <p class="text-brown-800 dark:text-brown-100 leading-none">
        <span class="text-7xl">{{ score }}</span
        ><span class="text-brown-500 dark:text-brown-400 text-xl"> / {{ total }}</span>
      </p>
    </div>

    <div class="w-full p-4 flex justify-center">
      <ui-button data-testid="session-complete__done" class="max-sm:w-full!" size="xl" @click="close">{{ t('common.done') }}</ui-button>
    </div>
  </div>
</template>
