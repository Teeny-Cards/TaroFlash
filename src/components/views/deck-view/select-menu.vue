<script setup lang="ts">
import UiButton from '@/components/ui-kit/button.vue'

defineProps<{
  open: boolean
  allCardsSelected: boolean
  selectedCardCount: number
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'toggle-all'): void
  (e: 'move'): void
  (e: 'delete'): void
}>()
</script>

<template>
  <div
    data-testid="card-list__select-menu"
    class="fixed bottom-6 bg-white rounded-6 shadow-popover p-3 pr-6 flex justify-center items-center gap-4
      transition-transform duration-100 ease-in-out"
    :class="{ 'transform translate-y-20': !open }"
  >
    <ui-button icon-left="close" variant="muted" @click="emit('cancel')">Cancel</ui-button>
    <ui-button inverted icon-left="check" @click="emit('toggle-all')">
      {{ allCardsSelected ? 'Deselect All' : 'Select All' }}
    </ui-button>
    <ui-button inverted icon-left="arrow-forward" @click="emit('move')">Move</ui-button>
    <ui-button variant="danger" inverted icon-left="delete" @click="emit('delete')"
      >Delete ({{ selectedCardCount ?? 0 }})</ui-button
    >
  </div>
</template>
