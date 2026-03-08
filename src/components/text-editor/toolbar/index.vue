<script setup lang="ts">
import BgColorSelector from './bg-color-selector.vue'
import FontSizeSelector from './font-size-selector.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiImage from '@/components/ui-kit/image.vue'
import { useTextComposerToolbar } from '@/composables/use-text-composer-toolbar'

const { setFontSize, block_type } = useTextComposerToolbar()
</script>

<template>
  <div
    data-testid="text-editor-toolbar"
    ref="text-editor-toolbar"
    class="flex gap-1 items-center justify-center transition-transform duration-100 ease-in-out z-10
      text-brown-700"
  >
    <font-size-selector :selected_font_size="block_type" @select="setFontSize" />

    <!-- <div class="toolbar-option" @mousedown.prevent @click="text_composer.toggleList">
        <ui-icon src="bullets" />
      </div> -->

    <div class="toolbar-option" @mousedown.prevent>
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
</template>

<style>
.toolbar-option {
  cursor: pointer;
  padding: 8px;
  border-radius: var(--radius-2_5);
  color: var(--color-grey-900);
  background-color: var(--color-brown-100);
}
</style>
