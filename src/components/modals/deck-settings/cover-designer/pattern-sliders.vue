<script setup lang="ts">
import { computed } from 'vue'
import UiSlider from '@/components/ui-kit/slider.vue'

type PatternSlidersProps = {
  pattern_size: number | undefined
  pattern_opacity: number | undefined
}

const { pattern_size, pattern_opacity } = defineProps<PatternSlidersProps>()

const emit = defineEmits<{
  (e: 'update:size', size: number): void
  (e: 'update:opacity', opacity: number): void
}>()

const SIZE_MIN = 10
const SIZE_MAX = 50

const sizePercent = computed<number>({
  get: () => {
    if (pattern_size === undefined) return 25
    return Math.round(((pattern_size - SIZE_MIN) / (SIZE_MAX - SIZE_MIN)) * 100)
  },
  set: (percent: number) => {
    emit('update:size', Math.round(SIZE_MIN + (percent / 100) * (SIZE_MAX - SIZE_MIN)))
  }
})

const opacityPercent = computed<number>({
  get: () => {
    if (pattern_opacity === undefined) return 40
    return Math.round(pattern_opacity * 100)
  },
  set: (percent: number) => {
    emit('update:opacity', percent / 100)
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

    <div data-testid="pattern-picker__opacity-row" class="flex flex-col gap-1.5">
      <span class="text-brown-600 text-xs font-medium">Opacity</span>
      <ui-slider v-model="opacityPercent" />
    </div>
  </div>
</template>
