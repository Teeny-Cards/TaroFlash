<script setup lang="ts">
import UiIcon from '@/components/ui-kit/icon.vue'

defineProps<{
  icon?: string
}>()
</script>

<template>
  <button data-testid="ui-kit-split-button__option" class="ui-kit-split-button__option">
    <ui-icon v-if="icon" :src="icon" size="small" />
    <slot></slot>
  </button>
</template>

<style>
.ui-kit-split-button__option {
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 6px 14px;
  height: 100%;

  color: var(--color-white);
  border-radius: var(--radius-1_5);
  outline: none;
  cursor: pointer;

  background-color: var(--split-button-theme);
}
.ui-kit-split-button__option:hover {
  scale: 1.1;
}
</style>
