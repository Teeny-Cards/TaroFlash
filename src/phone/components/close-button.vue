<script setup lang="ts">
import UiIcon from '@/components/ui-kit/icon.vue'

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <button
    data-testid="close-button"
    class="bg-brown-300 rounded-full text-brown-500 cursor-pointer p-2 z-10"
    @click="$emit('close')"
  >
    <ui-icon src="close" size="base" />
  </button>
</template>
