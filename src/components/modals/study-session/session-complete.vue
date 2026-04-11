<script setup lang="ts">
import { computed } from 'vue'
import UiButton from '@/components/ui-kit/button.vue'
import { useI18n } from 'vue-i18n'
import type { SecondaryAction } from '@/composables/modals/use-study-modal'

const { score, total, secondary_action, close } = defineProps<{
  score: number
  total: number
  secondary_action: SecondaryAction
  close: (action?: SecondaryAction) => void
}>()

const { t } = useI18n()

const percentage = computed(() => {
  if (!total) return 0
  return Math.round((score / total) * 100)
})

const tier = computed(() => {
  if (percentage.value === 100) return 'tier-100'
  if (percentage.value >= 80) return 'tier-80'
  if (percentage.value >= 60) return 'tier-60'
  return 'tier-low'
})

const heading = computed(() => t(`study-session.complete.${tier.value}.heading`))
const message = computed(() => t(`study-session.complete.${tier.value}.message`))
const secondary_label = computed(() => t(`study-session.complete.${secondary_action}`))
</script>

<template>
  <div
    class="bg-brown-300 dark:bg-grey-800 rounded-t-8 rounded-b-8 shadow-2xl overflow-hidden w-full sm:max-w-100 h-full max-h-120 shadow-sm flex flex-col items-center justify-between mx-2 mb-2"
    @click.stop
  >
    <div
      class="w-full bg-purple-500 wave-bottom-[50px] bgx-diagonal-stripes bgx-size-20 px-13 py-11.5 pb-14 text-center"
    >
      <h1 data-testid="session-complete__heading" class="text-white text-5xl">{{ heading }}</h1>
    </div>

    <div class="h-full w-full flex flex-col items-center justify-center gap-5 px-6 pb-6 -mt-2">
      <p class="text-brown-700 dark:text-brown-300 text-lg text-center">{{ message }}</p>
      <p class="text-brown-700 dark:text-brown-300 leading-none">
        <span class="text-7xl">{{ score }}</span
        ><span class="text-brown-500 dark:text-brown-400 text-xl"> / {{ total }}</span>
      </p>
    </div>

    <div class="w-full p-4 flex gap-2 justify-center">
      <ui-button
        data-testid="session-complete__close"
        class="max-sm:flex-1!"
        size="xl"
        @click="close()"
        >{{ t('common.close') }}</ui-button
      >
      <ui-button
        data-testid="session-complete__secondary"
        class="max-sm:flex-1!"
        size="xl"
        @click="close(secondary_action)"
        >{{ secondary_label }}</ui-button
      >
    </div>
  </div>
</template>
