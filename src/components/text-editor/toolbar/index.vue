<script setup lang="ts">
import BgColorSelector from './bg-color-selector.vue'
import FontSizeSelector from './font-size-selector.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiImage from '@/components/ui-kit/image.vue'
import BlockEditor from '@/utils/block-editor'

const block_editor = BlockEditor.getInstance()
</script>

<template>
  <div
    data-testid="text-editor-toolbar"
    ref="text-editor-toolbar"
    class="fixed bottom-6 bg-white rounded-6 shadow-sm pl-3 pr-6.5 flex justify-center items-end
      gap-6 transition-transform duration-100 ease-in-out border-t border-l border-r
      border-brown-100 h-15 z-10"
  >
    <div class="flex gap-1.5 items-center h-full py-3">
      <font-size-selector @select="block_editor.setBlock" />

      <div class="toolbar-option" @mousedown.prevent @click="block_editor.toggleBullets">
        <ui-icon src="bullets" />
      </div>

      <div class="toolbar-option">
        <ui-icon src="horizontal-rule" />
      </div>

      <div class="toolbar-option">
        <ui-icon src="align-v-top" />
      </div>

      <div class="toolbar-option">
        <ui-icon src="align-v-center" />
      </div>

      <div class="toolbar-option">
        <ui-icon src="align-v-bottom" />
      </div>

      <div class="toolbar-option">
        <ui-icon src="align-left" />
      </div>

      <div class="toolbar-option">
        <ui-icon src="align-center" />
      </div>

      <div class="toolbar-option">
        <ui-icon src="align-right" />
      </div>
    </div>

    <div class="h-full flex items-center">
      <div class="h-8 border-r border-brown-800"></div>
    </div>

    <!-- <bg-color-selector :color="selection_format?.color" @select="cardBgColor" /> -->
    <ui-image src="pencil" size="unset" />
    <ui-image src="highlighter" size="unset" />
  </div>
</template>

<style>
.toolbar-option {
  cursor: pointer;
  padding: 8px;
  color: var(--color-grey-900);
}
</style>
