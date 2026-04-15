<script setup lang="ts">
import { computed } from 'vue'
import UiSlider from '@/components/ui-kit/slider.vue'

type PatternSlidersProps = {
  pattern_size: number | undefined
}

const { pattern_size } = defineProps<PatternSlidersProps>()

const emit = defineEmits<{
  (e: 'update:size', size: number): void
}>()

const SIZE_MIN = 20
const SIZE_MAX = 100

const sizePercent = computed<number>({
  get: () => {
    if (pattern_size === undefined) return 50
    return Math.round(((pattern_size - SIZE_MIN) / (SIZE_MAX - SIZE_MIN)) * 100)
  },
  set: (percent: number) => {
    emit('update:size', Math.round(SIZE_MIN + (percent / 100) * (SIZE_MAX - SIZE_MIN)))
  }
})
</script>

<template>
  <div
    data-testid="pattern-picker__sliders"
    class="flex flex-col gap-3 pt-1 border-t border-brown-300"
  >
    <div data-testid="pattern-picker__size-row" class="flex flex-col gap-1.5">
      <span class="text-brown-600 text-xs font-medium">Size</span>
      <ui-slider v-model="sizePercent" />
    </div>
  </div>
</template>
