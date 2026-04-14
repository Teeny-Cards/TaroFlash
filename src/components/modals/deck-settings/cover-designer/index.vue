<script setup lang="ts">
import Popover from './popover.vue'
import type { ImageUploadPayload } from '@/components/image-uploader.vue'
import BgColorPicker from './bg-color-picker.vue'
import Border from './border.vue'
import BorderSliders from './border-sliders.vue'
import PatternPicker from './pattern-picker.vue'
import PatternSliders from './pattern-sliders.vue'

type CoverDesignerToolbarProps = {
  config: DeckCover
}

const { config } = defineProps<CoverDesignerToolbarProps>()

defineEmits<{
  (e: 'cover-image-change', payload: ImageUploadPayload): void
  (e: 'cover-image-remove'): void
}>()

const supported_themes: MemberTheme[] = [
  'blue-500',
  'green-400',
  'purple-500',
  'pink-400',
  'red-500',
  'orange-500'
]
</script>

<template>
  <div data-testid="cover-designer-toolbar">
    <div data-testid="cover-designer-toolbar__controls" class="flex sm:flex-col gap-4">
      <popover label="BG Color" icon="paint-brush">
        <bg-color-picker
          :supported_themes="supported_themes"
          :bg_color="config.bg_color"
          @select="config.bg_color = $event"
        />
      </popover>

      <popover label="Border" icon="border-outer">
        <border
          :supported_themes="supported_themes"
          :border_color="config.border_color"
          :border_size="config.border_size"
          :bg_color="config.bg_color"
          @select="config.border_color = $event"
        />

        <template v-if="config.border_color" #extra>
          <border-sliders
            :border_size="config.border_size"
            @update:size="config.border_size = $event"
          />
        </template>
      </popover>

      <popover label="Pattern" icon="texture-add">
        <pattern-picker
          :pattern="config.pattern"
          :pattern_size="config.pattern_size"
          :pattern_opacity="config.pattern_opacity"
          :bg_color="config.bg_color"
          @select="config.pattern = $event"
        />

        <template v-if="config.pattern" #extra>
          <pattern-sliders
            :pattern_size="config.pattern_size"
            :pattern_opacity="config.pattern_opacity"
            @update:size="config.pattern_size = $event"
            @update:opacity="config.pattern_opacity = $event"
          />
        </template>
      </popover>
    </div>
  </div>
</template>
