<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UiIcon from '@/components/ui-kit/icon.vue'
import { emitSfx } from '@/sfx/bus'
import { patternOpacity, patternSize } from '@/utils/cover'

const { t } = useI18n()

type PatternPickerProps = {
  supported_patterns: DeckCoverPattern[]
  selected_pattern: DeckCoverPattern | undefined
  pattern_size: number | undefined
}

const { selected_pattern, pattern_size } = defineProps<PatternPickerProps>()

const emit = defineEmits<{
  (e: 'update:pattern', pattern: DeckCoverPattern | undefined): void
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
  <div data-testid="pattern-picker-container" class="flex flex-col gap-2.5">
    <h3 data-testid="pattern-picker__label" class="text-brown-700 dark:text-brown-100">
      {{ t('deck.settings-modal.cover.pattern') }}
    </h3>

    <div data-testid="pattern-picker" class="flex flex-wrap gap-2">
      <button
        v-for="pattern in supported_patterns"
        :key="pattern"
        :data-testid="`pattern-picker__option-${pattern}`"
        :data-selected="pattern === selected_pattern || undefined"
        v-sfx.hover="'ui.click_07'"
        :class="`bgx-${pattern}`"
        :style="swatchStyle(pattern)"
        class="w-14.5 aspect-square rounded-6 rounded-tr-3 rounded-bl-3 cursor-pointer bg-(--theme-primary) data-selected:ring-3 ring-brown-700 relative"
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
        class="w-14.5 aspect-square rounded-6 rounded-tr-3 rounded-bl-3 cursor-pointer bg-brown-200 border-2 border-dashed border-brown-400 flex items-center justify-center text-brown-500 text-xs font-medium"
        @click="onPatternSelect(undefined)"
      >
        {{ t('deck.settings-modal.cover.pattern-picker.none-option') }}
      </button>
    </div>
  </div>
</template>
