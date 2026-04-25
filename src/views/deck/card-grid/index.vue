<script setup lang="ts">
import GridItem from './grid-item.vue'
import { type CardListController } from '@/composables/card-editor/card-list-controller'
import { inject, ref, useTemplateRef } from 'vue'

const {
  all_cards,
  is_selecting,
  isCardSelected,
  card_attributes,
  hasNextPage,
  isLoading,
  observeSentinel
} = inject<CardListController>('card-editor')!

const side = ref<'front' | 'back'>('front')
const sentinel = useTemplateRef<HTMLElement>('sentinel')

observeSentinel(sentinel)

const emit = defineEmits<{
  (e: 'card-selected', id: number): void
  (e: 'card-deleted', id: number): void
}>()
</script>

<template>
  <div
    data-testid="card-grid-container"
    class="flex flex-col items-center w-full max-w-208 xl:max-w-full"
  >
    <div
      data-testid="card-grid"
      class="grid grid-cols-[repeat(auto-fit,minmax(176px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(192px,1fr))] justify-items-center gap-2 md:gap-4 py-3 w-full"
    >
      <grid-item
        v-for="card in all_cards"
        :key="card.client_id"
        :card="card"
        :is_selecting="is_selecting"
        :side="side"
        :card_attributes="card_attributes"
        :selected="card.id !== undefined ? isCardSelected(card.id) : false"
        @card-selected="emit('card-selected', card.id!)"
      ></grid-item>
    </div>
    <div
      v-if="hasNextPage"
      ref="sentinel"
      data-testid="card-grid__sentinel"
      class="w-full py-6 flex items-center justify-center text-brown-500"
    >
      <span v-if="isLoading">Loading…</span>
    </div>
  </div>
</template>
