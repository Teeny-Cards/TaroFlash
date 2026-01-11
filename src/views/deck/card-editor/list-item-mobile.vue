<script setup lang="ts">
import Card from '@/components/card/index.vue'
import { type CardEditorMode } from '@/composables/card-bulk-editor'
import { type TextEditorUpdatePayload } from '@/composables/rich-text-editor'

const { card, mode, active, active_side } = defineProps<{
  index: number
  card: Card
  mode: CardEditorMode
  active: boolean
  selected: boolean
  is_duplicate?: boolean
  active_side: 'front' | 'back'
}>()

const emit = defineEmits<{
  (e: 'selected'): void
  (e: 'deleted'): void
  (e: 'moved'): void
  (e: 'activated'): void
  (e: 'deactivated'): void
  (e: 'updated', id: number, side: 'front' | 'back', payload: TextEditorUpdatePayload): void
  (e: 'side-changed', side: 'front' | 'back'): void
  (e: 'add-card', side: 'left' | 'right'): void
}>()
</script>

<template>
  <card v-bind="card" size="xl" class="shrink-0" mode="edit"></card>
</template>
