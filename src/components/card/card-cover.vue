<script setup lang="ts">
import { computed } from 'vue'

const { cover } = defineProps<{
  cover?: DeckCover
}>()

// Static map — ensures all bgx-* class names are present as literals so the
// build scanner includes them in the CSS output.
const PATTERN_CLASS: Record<DeckCoverPattern, string> = {
  'diagonal-stripes': 'bgx-diagonal-stripes',
  saw: 'bgx-saw',
  wave: 'bgx-wave',
  'bank-note': 'bgx-bank-note',
  aztec: 'bgx-aztec',
  'endless-clouds': 'bgx-endless-clouds',
  stars: 'bgx-stars',
  leaf: 'bgx-leaf',
  'dot-grid': 'bgx-dot-grid'
}

const patternClass = computed(() => (cover?.pattern ? PATTERN_CLASS[cover.pattern] : undefined))

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
