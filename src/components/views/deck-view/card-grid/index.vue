<script setup lang="ts">
import GridItem from './grid-item.vue'

const { mode, side = 'front' } = defineProps<{
  cards: Card[]
  mode: 'edit' | 'view' | 'select'
  side?: 'front' | 'back'
  selectedCardIds?: number[]
}>()

const emit = defineEmits<{
  (e: 'card-selected', id: number): void
  (e: 'card-deleted', id: number): void
}>()
</script>

<template>
  <div data-testid="card-grid" class="grid grid-cols-[repeat(auto-fit,192px)] gap-4 py-3">
    <grid-item
      v-for="card in cards"
      :card="card"
      :mode="mode"
      :side="side"
      :selected="selectedCardIds?.includes(card.id!) ?? false"
      @card-selected="emit('card-selected', card.id!)"
    ></grid-item>
  </div>
</template>
