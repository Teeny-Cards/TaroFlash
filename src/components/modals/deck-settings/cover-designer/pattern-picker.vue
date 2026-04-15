<script setup lang="ts">
import { emitSfx } from '@/sfx/bus'
import { patternOpacity, patternSize } from '@/utils/cover'

type PatternPickerProps = {
  pattern: DeckCoverPattern | undefined
  pattern_size: number | undefined
  bg_color: MemberTheme | undefined
}

const { pattern, pattern_size, bg_color } = defineProps<PatternPickerProps>()

const emit = defineEmits<{
  (e: 'select', pattern: DeckCoverPattern | undefined): void
}>()

const patterns: DeckCoverPattern[] = [
  'diagonal-stripes',
  'wave',
  'bank-note',
  'aztec',
  'endless-clouds'
]

function swatchStyle(p: DeckCoverPattern): Record<string, string> {
  return {
    '--bgx-fill': 'var(--theme-neutral)',
    '--bgx-opacity': patternOpacity(p, 1),
    ...(pattern_size ? { '--bgx-size': patternSize(p, pattern_size) } : {})
  }
}

function onPatternSelect(p: DeckCoverPattern | undefined) {
  if (p === pattern) {
    emitSfx('ui.digi_powerdown')
    return
  }

  emitSfx('ui.etc_camera_shutter')
  emit('select', p)
}
</script>

<template>
  <button
    v-for="p in patterns"
    :key="p"
    :data-testid="`pattern-picker__option-${p}`"
    :data-theme="bg_color ?? 'purple-500'"
    :data-selected="p === pattern || undefined"
    :class="`bgx-${p}`"
    :style="swatchStyle(p)"
    class="w-full aspect-square rounded-2 cursor-pointer bg-(--theme-primary)"
    @click="onPatternSelect(p)"
  />

  <button
    data-testid="pattern-picker__none"
    :data-selected="pattern === undefined || undefined"
    class="w-full aspect-square rounded-2 cursor-pointer bg-brown-200 border-2 border-dashed border-brown-400 flex items-center justify-center text-brown-500 text-xs font-medium"
    @click="onPatternSelect(undefined)"
  >
    None
  </button>
</template>
