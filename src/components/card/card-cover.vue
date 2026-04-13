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

  if (cover?.bg_image) {
    style.backgroundImage = `url('${cover.bg_image}')`
    style.backgroundSize = 'cover'
    style.backgroundPosition = 'center'
  }

  if (cover?.border_color) {
    const width = cover.border_size ? `${cover.border_size}px` : 'var(--face-border-width)'
    style.border = `${width} solid var(--color-${cover.border_color})`
  }

  if (cover?.pattern) {
    style['--bgx-opacity'] = String(cover.pattern_opacity ?? 0.4)
    if (cover.pattern_size) {
      style['--bgx-size'] = `${cover.pattern_size}px`
    }
  }

  return style
})
</script>

<template>
  <div
    data-testid="card-cover"
    :data-theme="cover?.bg_color"
    class="card-cover bgx-(--theme-neutral)"
    :class="patternClass"
    :style="coverStyle"
  />
</template>

<style>
.card-cover {
  width: 100%;
  height: 100%;
  border-radius: var(--face-radius);
  box-sizing: border-box;
}
</style>
