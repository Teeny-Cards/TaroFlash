<script setup lang="ts">
import { reactive } from 'vue'
import Card from '@/components/card/index.vue'
import coverDesignerColorPicker from './cover-designer-color-picker.vue'
import type { ImageUploadPayload } from '@/components/image-uploader.vue'

type CoverDesignerProps = {
  coverConfig?: DeckCover
}

const { coverConfig } = defineProps<CoverDesignerProps>()

const emit = defineEmits<{
  (e: 'cover-image-change', payload: ImageUploadPayload): void
  (e: 'cover-image-remove'): void
}>()

const config = reactive<DeckCover>(coverConfig ?? {})

const supported_themes: MemberTheme[] = [
  'blue-500',
  'green-400',
  'purple-500',
  'pink-400',
  'red-500',
  'orange-500'
]

function onBgColorChange(theme: MemberTheme | undefined) {
  config.bg_color = theme
}
</script>

<template>
  <div data-testid="tab-cover" class="flex flex-col sm:flex-row justify-center items-center gap-6">
    <div data-testid="tab-cover__preview" class="flex flex-col items-center w-min gap-3 relative">
      <card size="xl" side="cover" :cover_config="config" />
    </div>

    <div data-testid="tab-cover__settings" class="grid max-sm:grid-cols-4 sm:grid-rows-4 gap-4">
      <cover-designer-color-picker
        label="BG Color"
        icon="paint-brush"
        :supported_themes="supported_themes"
        :selected_theme="config.bg_color"
        @select="onBgColorChange"
      />
      <cover-designer-color-picker
        label="Border Color"
        icon="border-outer"
        :supported_themes="supported_themes"
      />
      <cover-designer-color-picker
        label="Pattern"
        icon="texture-add"
        :supported_themes="supported_themes"
      />
      <cover-designer-color-picker
        label="Pattern Color"
        icon="stroke-full"
        :supported_themes="supported_themes"
      />
    </div>
  </div>
</template>
