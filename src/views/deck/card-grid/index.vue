<script setup lang="ts">
import GridItem from './grid-item.vue'
import { type CardBulkEditor } from '@/composables/card-bulk-editor'
import { inject, ref } from 'vue'

const { all_cards, mode, selected_card_ids } = inject<CardBulkEditor>('card-editor')!

const side = ref<'front' | 'back'>('front')

const emit = defineEmits<{
  (e: 'card-selected', id: number): void
  (e: 'card-deleted', id: number): void
}>()
</script>

<template>
  <div
    data-testid="card-grid"
    class="grid grid-cols-[repeat(auto-fit,minmax(176px,1fr))]
      sm:grid-cols-[repeat(auto-fit,minmax(192px,1fr))] justify-items-center gap-2 md:gap-4 py-3
      w-full max-w-208 xl:max-w-full"
  >
    <grid-item
      v-for="card in all_cards"
      :card="card"
      :mode="mode"
      :side="side"
      :selected="selected_card_ids?.includes(card.id!) ?? false"
      @card-selected="emit('card-selected', card.id!)"
    ></grid-item>
  </div>
</template>
