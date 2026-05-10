<script setup lang="ts">
import type { ImageUploadPayload } from '@/components/image-uploader.vue'
import BgColorPicker from './bg-color-picker.vue'
import IconPicker from './icon-picker.vue'
import PatternPicker from './pattern-picker.vue'

type CoverDesignerToolbarProps = {
  config: DeckCover
}

const { config } = defineProps<CoverDesignerToolbarProps>()

defineEmits<{
  (e: 'cover-image-change', payload: ImageUploadPayload): void
  (e: 'cover-image-remove'): void
}>()

const supported_themes: DeckTheme[] = [
  { light: 'green-500', dark: 'green-800' },
  { light: 'blue-500', dark: 'blue-650' },
  { light: 'purple-500', dark: 'purple-700' },
  { light: 'pink-500', dark: 'pink-700' },
  { light: 'red-500', dark: 'red-600' },
  { light: 'orange-700', dark: 'orange-700' },
  { light: 'yellow-500', dark: 'yellow-700' }
]

const supported_patterns: DeckCoverPattern[] = [
  'diagonal-stripes',
  'wave',
  'bank-note',
  'aztec',
  'endless-clouds'
]

const supported_icons: string[] = [
  'card-deck',
  'book',
  'school-cap',
  'music-note',
  'moon-stars',
  'cable-car',
  'bell',
  'public',
  'id-card',
  'store',
  'teeny-cards'
]
</script>

<template>
  <div data-testid="cover-designer-toolbar">
    <div data-testid="cover-designer-toolbar__controls" class="flex flex-col gap-4">
      <bg-color-picker
        :supported_themes="supported_themes"
        :bg_color="config.bg_color"
        :bg_color_dark="config.bg_color_dark"
        :border_size="config.border_size"
        @update:bg_color="config.bg_color = $event"
        @update:bg_color_dark="config.bg_color_dark = $event"
        @update:border_size="config.border_size = $event"
      />

      <icon-picker
        :supported_icons="supported_icons"
        :icon="config.icon"
        @update:icon="config.icon = $event"
      />

      <pattern-picker
        :supported_patterns="supported_patterns"
        :selected_pattern="config.pattern"
        :pattern_size="config.pattern_size"
        @update:pattern="config.pattern = $event"
      />
    </div>
  </div>
</template>
