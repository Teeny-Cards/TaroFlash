<script setup lang="ts">
import UiIcon from '@/components/ui-kit/icon.vue'
import { emitSfx } from '@/sfx/bus'
import { patternOpacity, patternSize } from '@/utils/cover'
import PickerPopover from './picker-popover.vue'

type PatternPickerProps = {
  supported_patterns: DeckCoverPattern[]
  selected_pattern: DeckCoverPattern | undefined
  pattern_size: number | undefined
  bg_color: MemberTheme | undefined
}

const { selected_pattern, pattern_size, bg_color } = defineProps<PatternPickerProps>()

const emit = defineEmits<{
  (e: 'update:pattern', pattern: DeckCoverPattern | undefined): void
  (e: 'update:pattern_size', size: number): void
}>()

function swatchStyle(p: DeckCoverPattern): Record<string, string> {
  return {
    '--bgx-fill': 'var(--theme-neutral)',
    '--bgx-opacity': patternOpacity(p, 1),
    ...(pattern_size ? { '--bgx-size': patternSize(p, pattern_size, 0.65) } : {})
  }
}

function onPatternSelect(p: DeckCoverPattern | undefined) {
  if (p === selected_pattern) {
    emitSfx('ui.digi_powerdown')
    return
  }

  emitSfx('ui.toggle_on')
  emit('update:pattern', p)
}
</script>

<template>
  <picker-popover label="Pattern" icon="texture-add" size="lg">
    <template #default>
      <button
        v-for="pattern in supported_patterns"
        :key="pattern"
        :data-testid="`pattern-picker__option-${pattern}`"
        :data-theme="'brown-300'"
        :data-selected="pattern === selected_pattern || undefined"
        v-sfx.hover="'ui.click_07'"
        :class="`bgx-${pattern}`"
        :style="swatchStyle(pattern)"
        class="w-full aspect-square rounded-4 rounded-tr-2 rounded-bl-2 cursor-pointer bg-(--theme-primary) data-selected:ring-3 ring-brown-700 relative"
        @click="onPatternSelect(pattern)"
      >
        <div
          v-if="pattern === selected_pattern"
          class="absolute -top-2 -right-2 bg-brown-700 p-0.5 rounded-full flex items-center justify-center"
        >
          <ui-icon src="check" class="text-(--theme-primary)" />
        </div>
      </button>

      <button
        data-testid="pattern-picker__none"
        :data-selected="selected_pattern === undefined || undefined"
        class="w-full aspect-square rounded-4 rounded-tr-2 rounded-bl-2 cursor-pointer bg-brown-200 border-2 border-dashed border-brown-400 flex items-center justify-center text-brown-500 text-xs font-medium"
        @click="onPatternSelect(undefined)"
      >
        None
      </button>
    </template>
  </picker-popover>
</template>
