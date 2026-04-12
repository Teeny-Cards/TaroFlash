<script setup lang="ts">
import { reactive } from 'vue'
import Card from '@/components/card/index.vue'
import CoverDesignerPopover from './cover-designer-popover.vue'
import type { ImageUploadPayload } from '@/components/image-uploader.vue'
import CoverDesignerBgColorPicker from './cover-designer-bg-color-picker.vue'

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
</script>

<template>
  <div data-testid="tab-cover" class="flex flex-col sm:flex-row justify-center items-center gap-6">
    <div data-testid="tab-cover__preview" class="flex flex-col items-center w-min gap-3 relative">
      <card size="xl" side="cover" :cover_config="config" />
    </div>

    <div data-testid="tab-cover__settings" class="grid max-sm:grid-cols-4 sm:grid-rows-4 gap-4">
      <CoverDesignerPopover label="BG Color" icon="paint-brush">
        <CoverDesignerBgColorPicker
          :supported_themes="supported_themes"
          :bg_color="config.bg_color"
          @select="config.bg_color = $event"
        />
      </CoverDesignerPopover>

      <CoverDesignerPopover
        label="Border Color"
        icon="border-outer"
        :supported_themes="supported_themes"
      />
      <CoverDesignerPopover
        label="Pattern"
        icon="texture-add"
        :supported_themes="supported_themes"
      />
      <CoverDesignerPopover
        label="Pattern Color"
        icon="stroke-full"
        :supported_themes="supported_themes"
      />
    </div>
  </div>
</template>
