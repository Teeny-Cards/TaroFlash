<script setup lang="ts">
import { computed } from 'vue'
import UiButton from '@/components/ui-kit/button.vue'

const { score, total, close } = defineProps<{
  score: number
  total: number
  close: () => void
}>()

const percentage = computed(() => {
  if (!total) return 0
  return Math.round((score / total) * 100)
})

const heading = computed(() => {
  if (percentage.value === 100) return 'Perfect!'
  if (percentage.value >= 80) return 'Great job!'
  if (percentage.value >= 60) return 'Nice work!'
  return 'Keep it up!'
})
</script>

<template>
  <div
    class="bg-brown-200 dark:bg-grey-800 rounded-8 shadow-2xl overflow-hidden w-64 shadow-sm"
    @click.stop
  >
    <div class="bg-purple-500 wave-bottom-[24px] px-6 pt-5 pb-10 text-center">
      <p class="text-white/60 text-sm">Session complete</p>
      <h1 class="text-white text-3xl">{{ heading }}</h1>
    </div>

    <div class="flex flex-col items-center gap-5 px-6 pb-6 -mt-2">
      <p class="text-brown-800 dark:text-brown-100 leading-none">
        <span class="text-7xl">{{ score }}</span
        ><span class="text-brown-500 dark:text-brown-400 text-xl"> / {{ total }}</span>
      </p>

      <ui-button class="w-full" @click="close">Done</ui-button>
    </div>
  </div>
</template>
