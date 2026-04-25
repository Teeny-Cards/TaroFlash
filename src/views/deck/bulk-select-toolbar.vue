<script setup lang="ts">
import UiButton from '@/components/ui-kit/button.vue'
import { inject } from 'vue'
import { type CardListController } from '@/composables/card-editor/card-list-controller'

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'toggle-all'): void
  (e: 'move'): void
  (e: 'delete'): void
}>()

const editor = inject<CardListController>('card-editor')
</script>

<template>
  <div
    data-testid="card-list__select-menu"
    class="fixed bottom-6 bg-white rounded-6 shadow-sm p-3 pr-6 flex justify-center items-center gap-4 transition-transform duration-100 ease-in-out z-10"
    :class="{ 'transform translate-y-22': editor?.mode.value !== 'select' }"
  >
    <ui-button icon-left="close" theme="grey-400" @click="emit('cancel')">Cancel</ui-button>
    <ui-button theme="brown-100" icon-left="check" @click="emit('toggle-all')">
      {{ editor?.all_cards_selected.value ? 'Deselect All' : 'Select All' }}
    </ui-button>
    <ui-button
      theme="brown-100"
      icon-left="arrow-forward"
      :disabled="editor?.select_all_mode.value"
      @click="emit('move')"
      >Move</ui-button
    >
    <ui-button theme="red-500" icon-left="delete" @click="emit('delete')"
      >Delete ({{ editor?.selected_count.value ?? 0 }})</ui-button
    >
  </div>
</template>
