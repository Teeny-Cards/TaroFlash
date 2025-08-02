<script setup lang="ts">
defineProps<{
  showBackground?: boolean
}>()
</script>

<template>
  <div data-testid="ui-kit-list-item" class="ui-kit-list-item group">
    <slot name="before"></slot>
    <slot></slot>
    <slot name="after"></slot>

    <div
      v-if="showBackground"
      data-testid="ui-kit-list-item__background"
      class="ui-kit-list-item__background"
    ></div>
  </div>
</template>

<style>
@reference '@/styles/main.css';

.ui-kit-list-item {
  @apply relative grid w-full grid-cols-[auto_1fr_auto] items-center gap-6 py-3;
}

.ui-kit-list-item__background {
  @apply rounded-6 bg-brown-300 absolute top-1 -right-3 bottom-1 -left-3 -z-1 hidden group-hover:block;
}
</style>
