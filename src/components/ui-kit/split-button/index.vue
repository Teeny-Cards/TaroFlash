<script setup lang="ts">
import { ref } from 'vue'
import { emitSfx } from '@/sfx/bus'
import UiIcon from '@/components/ui-kit/icon.vue'
import Option from './option.vue'

const { theme = 'blue' } = defineProps<{
  theme?: 'blue' | 'purple' | 'orange' | 'green' | 'pink' | 'red' | 'grey'
}>()

const open = ref(false)

function onToggle() {
  emitSfx('ui.etc_camera_reel')
  open.value = !open.value
}
</script>

<template>
  <div
    data-testid="ui-kit-split-button"
    class="ui-kit-split-button"
    :class="`ui-kit-split-button__option--${theme}`"
  >
    <div data-testid="ui-kit-split-button__default-options" class="flex gap-0.5 h-full">
      <slot name="defaults" :option="Option"></slot>
    </div>

    <button
      data-testid="ui-kit-split-button__toggle"
      class="ui-kit-split-button__toggle"
      @click="onToggle"
    >
      <ui-icon src="arrow-drop-down" size="large" />
    </button>

    <div
      v-if="open"
      data-testid="ui-kit-split-button__dropdown"
      class="ui-kit-split-button__dropdown"
    >
      <slot name="options" :option="Option"></slot>
    </div>
  </div>
</template>

<style>
.ui-kit-split-button {
  position: relative;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.ui-kit-split-button__option:first-child {
  border-start-start-radius: var(--radius-4);
  border-end-start-radius: var(--radius-4);
}

.ui-kit-split-button__toggle {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;
  width: 36px;

  border-start-end-radius: var(--radius-4);
  border-end-end-radius: var(--radius-4);
  border-start-start-radius: var(--radius-1_5);
  border-end-start-radius: var(--radius-1_5);

  background-color: var(--split-button-theme);
  color: var(--color-white);
  outline: none;
  cursor: pointer;
}
.ui-kit-split-button__toggle:hover {
  scale: 1.1;
}

.ui-kit-split-button__dropdown {
  position: absolute;
  top: 100%;
  right: 0;

  display: flex;
  flex-direction: column;
  gap: 3px;

  z-index: 10;
  min-width: 100%;
  margin-top: 3px;
}

.ui-kit-split-button__option--blue {
  --split-button-theme: var(--color-blue-500);
}

.ui-kit-split-button__option--purple {
  --split-button-theme: var(--color-purple-400);
}

.ui-kit-split-button__option--orange {
  --split-button-theme: var(--color-orange-500);
}

.ui-kit-split-button__option--green {
  --split-button-theme: var(--color-green-500);
}

.ui-kit-split-button__option--pink {
  --split-button-theme: var(--color-pink-500);
}

.ui-kit-split-button__option--red {
  --split-button-theme: var(--color-red-500);
}

.ui-kit-split-button__option--grey {
  --split-button-theme: var(--color-grey-400);
}
</style>
