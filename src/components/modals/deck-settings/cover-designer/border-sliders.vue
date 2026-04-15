<script setup lang="ts">
import { computed } from 'vue'
import UiSlider from '@/components/ui-kit/slider.vue'

type BorderSlidersProps = {
  border_size: number | undefined
}

const { border_size } = defineProps<BorderSlidersProps>()

const emit = defineEmits<{
  (e: 'update:size', size: number): void
}>()

const SIZE_MIN = 1
const SIZE_MAX = 16

const sizePercent = computed<number>({
  get: () => {
    if (border_size === undefined) return 25
    return Math.round(((border_size - SIZE_MIN) / (SIZE_MAX - SIZE_MIN)) * 100)
  },
  set: (percent: number) => {
    emit('update:size', Math.round(SIZE_MIN + (percent / 100) * (SIZE_MAX - SIZE_MIN)))
  }
})
</script>

<template>
  <div data-testid="border__sliders" class="flex flex-col gap-2 pt-3 border-t border-brown-300">
    <span data-testid="border__label" class="text-brown-700 text-sm font-medium">Border</span>
    <div data-testid="border__size-row" class="flex flex-col gap-1.5">
      <span class="text-brown-600 text-xs font-medium">Size</span>
      <ui-slider v-model="sizePercent" />
    </div>
  </div>
</template>
