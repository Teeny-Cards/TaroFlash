<script setup lang="ts">
import BgColorPicker from './bg-color-picker.vue'
import IconPicker from './icon-picker.vue'
import PatternPicker from './pattern-picker.vue'
import SectionList from '@/components/layout-kit/section-list.vue'
import { SUPPORTED_THEMES, SUPPORTED_PATTERNS, SUPPORTED_ICONS } from '@/utils/cover'

type CoverDesignerToolbarProps = {
  config: DeckCover
}

const { config } = defineProps<CoverDesignerToolbarProps>()
</script>

<template>
  <div
    data-testid="cover-designer-toolbar"
    :data-theme="config.bg_color"
    :data-theme-dark="config.bg_color_dark"
  >
    <section-list data-testid="cover-designer-toolbar__controls">
      <bg-color-picker
        :supported_themes="SUPPORTED_THEMES"
        :bg_color="config.bg_color"
        :bg_color_dark="config.bg_color_dark"
        :border_size="config.border_size"
        @update:bg_color="config.bg_color = $event"
        @update:bg_color_dark="config.bg_color_dark = $event"
        @update:border_size="config.border_size = $event"
      />

      <pattern-picker
        :supported_patterns="SUPPORTED_PATTERNS"
        :selected_pattern="config.pattern"
        :pattern_size="config.pattern_size"
        @update:pattern="config.pattern = $event"
      />

      <icon-picker
        :supported_icons="SUPPORTED_ICONS"
        :icon="config.icon"
        @update:icon="config.icon = $event"
      />
    </section-list>
  </div>
</template>
