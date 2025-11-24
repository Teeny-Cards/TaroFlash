<script setup lang="ts">
import { useRichTextEditor } from '@/composables/rich-text-editor'
import BgColorSelector from './bg-color-selector.vue'
import FontSizeSelector from './font-size-selector.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiImage from '@/components/ui-kit/image.vue'
import { onMounted, ref, useTemplateRef } from 'vue'

defineProps<{
  inactive_classes: string
}>()

const {
  selection_format,
  onActivate,
  onDeactivate,
  setToolbar,
  textSize,
  underline,
  align,
  divider,
  list,
  cardBgColor
} = useRichTextEditor()

const toolbar = useTemplateRef('text-editor-toolbar')
const active = ref(false)

onMounted(() => {
  setToolbar(toolbar.value)
})

onActivate(() => {
  active.value = true
})

onDeactivate(() => {
  active.value = false
})
</script>

<template>
  <div
    data-testid="text-editor-toolbar"
    ref="text-editor-toolbar"
    class="fixed bottom-6 bg-white rounded-6 shadow-cutout pl-3 pr-6.5 flex justify-center items-end gap-6
      transition-transform duration-100 ease-in-out border-t border-l border-r border-brown-100 h-15"
    :class="{ [inactive_classes]: !active }"
  >
    <div class="flex gap-1.5 items-center h-full py-3">
      <font-size-selector :selected_font_size="selection_format?.size" @select="textSize" />

      <div class="toolbar-option" @click="underline">
        <ui-icon src="underline" />
      </div>

      <div class="toolbar-option" @click="list('bullet')">
        <ui-icon src="bullets" />
      </div>

      <div class="toolbar-option" @click="divider">
        <ui-icon src="horizontal-rule" />
      </div>

      <div class="toolbar-option">
        <ui-icon src="link" />
      </div>

      <div class="toolbar-option" @click="align(false)">
        <ui-icon src="align-left" />
      </div>

      <div class="toolbar-option" @click="align('center')">
        <ui-icon src="align-center" />
      </div>

      <div class="toolbar-option" @click="align('right')">
        <ui-icon src="align-right" />
      </div>
    </div>

    <div class="h-full flex items-center">
      <div class="h-8 border-r border-brown-900"></div>
    </div>

    <bg-color-selector :color="selection_format?.color" @select="cardBgColor" />
    <ui-image src="pencil" size="unset" />
    <ui-image src="highlighter" size="unset" />
  </div>
</template>

<style>
.toolbar-option {
  cursor: pointer;
  padding: 8px;
}
</style>
