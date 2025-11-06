<script setup lang="ts">
import { useRichTextEditor } from '@/composables/rich-text-editor'
import ColorSelector from './color-selector.vue'
import UiPopover from '@/components/ui-kit/popover.vue'
import UiButton from '@/components/ui-kit/button.vue'
import { computed, onMounted, ref, useTemplateRef } from 'vue'

defineProps<{
  inactive_classes: string
}>()

const {
  active_el,
  selection_format,
  setToolbar,
  bold,
  italic,
  header,
  link,
  background,
  color,
  align
} = useRichTextEditor()

const toolbar = useTemplateRef('text-editor-toolbar')
const text_color_selector_open = ref(false)

onMounted(() => {
  setToolbar(toolbar.value)
})

function onChangeHeading(e: Event) {
  const v = (e.target as HTMLSelectElement).value as '' | '1' | '2' | '3'
  header(parseInt(v) as any)
}

function onChangeBgColor(e: Event) {
  const v = (e.target as HTMLSelectElement).value
  background(v)
}
</script>

<template>
  <div
    data-testid="text-editor-toolbar"
    ref="text-editor-toolbar"
    :class="{ [inactive_classes]: !active_el }"
  >
    <button :class="{ active: selection_format?.bold }" @click="bold"><b>B</b></button>
    <button :class="{ active: selection_format?.italic }" @click="italic"><i>I</i></button>

    <select :value="selection_format?.header" @change="onChangeHeading">
      <option value="">Paragraph</option>
      <option value="1">H1</option>
      <option value="2">H2</option>
      <option value="3">H3</option>
    </select>

    <button :class="{ active: selection_format?.link }" @click="link()">Link</button>

    <ui-popover mode="click" :open="text_color_selector_open" :clip_margin="0" shadow :gap="24">
      <template #trigger="">
        <ui-button @click="text_color_selector_open = !text_color_selector_open">Color</ui-button>
      </template>

      <color-selector :color="selection_format?.color" @select="color" />
    </ui-popover>

    <select :value="selection_format?.background" @change="onChangeBgColor">
      <option value="">BG</option>
      <option value="surface">Surface</option>
      <option value="brand">Brand</option>
    </select>

    <select
      :value="selection_format?.align"
      @change="align(($event.target as HTMLSelectElement).value as any)"
    >
      <option value="">Align</option>
      <option value="left">Left</option>
      <option value="center">Center</option>
      <option value="right">Right</option>
      <option value="justify">Justify</option>
    </select>
  </div>
</template>
