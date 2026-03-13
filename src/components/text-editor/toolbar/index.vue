<script setup lang="ts">
import FontSizeSelector from './font-size-selector.vue'
import AlignSelector from './align-selector.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import { useTextComposerToolbar } from '@/composables/use-text-composer-toolbar'
import { type SfxOptions } from '@/sfx/directive'

const { setFontSize, toggleUnorderedList, toggleUnderline, block_type } = useTextComposerToolbar()

const sfx: SfxOptions = { hover: 'ui.click_07', click: 'ui.select' }
const submenu_sfx: SfxOptions = { hover: 'ui.click_07', click: 'ui.toggle_on' }
</script>

<template>
  <div
    data-testid="text-editor-toolbar"
    ref="text-editor-toolbar"
    data-theme="brown-100"
    class="flex gap-1 items-center justify-center text-(--theme-on-primary)"
  >
    <font-size-selector
      class="toolbar-option"
      :selected_font_size="block_type"
      :sfx="sfx"
      @select="setFontSize"
    />

    <div
      class="toolbar-option toolbar-option--icon-only"
      @mousedown.prevent
      v-sfx="submenu_sfx"
      @click="toggleUnderline"
    >
      <ui-icon src="underline" />
    </div>

    <div
      class="toolbar-option toolbar-option--icon-only"
      @mousedown.prevent
      v-sfx="submenu_sfx"
      @click="toggleUnorderedList"
    >
      <ui-icon src="list" />
    </div>

    <align-selector
      class="toolbar-option toolbar-option--icon-only"
      :sfx="sfx"
      trigger-icon="horizontal-align"
    >
      <div class="toolbar-option toolbar-option--icon-only" v-sfx="submenu_sfx" @mousedown.prevent>
        <ui-icon src="align-left" />
      </div>
      <div class="toolbar-option toolbar-option--icon-only" v-sfx="submenu_sfx" @mousedown.prevent>
        <ui-icon src="align-center" />
      </div>
      <div class="toolbar-option toolbar-option--icon-only" v-sfx="submenu_sfx" @mousedown.prevent>
        <ui-icon src="align-right" />
      </div>
    </align-selector>

    <align-selector
      class="toolbar-option toolbar-option--icon-only"
      :sfx="sfx"
      trigger-icon="vertical-align"
    >
      <div class="toolbar-option toolbar-option--icon-only" v-sfx="submenu_sfx" @mousedown.prevent>
        <ui-icon src="align-left" />
      </div>
      <div class="toolbar-option toolbar-option--icon-only" v-sfx="submenu_sfx" @mousedown.prevent>
        <ui-icon src="align-center" />
      </div>
      <div class="toolbar-option toolbar-option--icon-only" v-sfx="submenu_sfx" @mousedown.prevent>
        <ui-icon src="align-right" />
      </div>
    </align-selector>
  </div>
</template>

<style>
.toolbar-option {
  height: 40px;
  padding: 8px;

  border-radius: var(--radius-2_5);
  color: var(--theme-on-primary);
  background-color: var(--theme-primary);

  cursor: pointer;
}

.toolbar-option:hover {
  background-color: var(--theme-secondary);
}

.toolbar-option.toolbar-option--icon-only {
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
