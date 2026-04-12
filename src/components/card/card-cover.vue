<script setup lang="ts">
import { computed } from 'vue'
import { BGX_PATTERN_CLASS } from '@/utils/bgx'

const { cover } = defineProps<{
  cover?: DeckCover
}>()

const patternClass = computed(() => (cover?.pattern ? BGX_PATTERN_CLASS[cover.pattern] : undefined))

const coverStyle = computed((): Record<string, string> => {
  const style: Record<string, string> = {
    backgroundColor: cover?.bg_color ? `var(--color-${cover.bg_color})` : 'var(--color-purple-500)'
  }

  if (cover?.border_color) {
    style.border = `var(--face-border-width) solid var(--color-${cover.border_color})`
  }

  if (cover?.pattern) {
    style['--bgx-fill'] = `var(--color-${cover.pattern_color ?? 'grey-900'})`
    style['--bgx-opacity'] = '0.4'
  }

  return style
})
</script>

<template>
  <div data-testid="card-cover" class="card-cover" :class="patternClass" :style="coverStyle" />
</template>

<style>
.card-cover {
  width: 100%;
  height: 100%;
  border-radius: var(--face-radius);
  box-sizing: border-box;
}
</style>
