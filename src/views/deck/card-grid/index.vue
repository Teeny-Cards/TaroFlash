<script setup lang="ts">
import GridItem from './grid-item.vue'
import { type CardBulkEditor } from '@/composables/card-bulk-editor'
import { inject, ref, useTemplateRef } from 'vue'
import { useInfiniteScroll } from '@/composables/use-infinite-scroll'
import { useCardsInDeckInfiniteQuery } from '@/api/cards'

const { all_cards, mode, isCardSelected, getKey } = inject<CardBulkEditor>('card-editor')!
const card_attributes = inject<DeckCardAttributes>('card-attributes')
const cards_query = inject<ReturnType<typeof useCardsInDeckInfiniteQuery>>('cards-query')!

const side = ref<'front' | 'back'>('front')
const sentinel = useTemplateRef<HTMLElement>('sentinel')

useInfiniteScroll(sentinel, () => cards_query.loadNextPage(), {
  enabled: () => cards_query.hasNextPage.value && !cards_query.isLoading.value
})

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
        :key="getKey(card)"
        :card="card"
        :mode="mode"
        :side="side"
        :card_attributes="card_attributes"
        :selected="card.id !== undefined ? isCardSelected(card.id) : false"
        @card-selected="emit('card-selected', card.id!)"
      ></grid-item>
    </div>
    <div
      v-if="cards_query.hasNextPage.value"
      ref="sentinel"
      data-testid="card-grid__sentinel"
      class="w-full py-6 flex items-center justify-center text-brown-500"
    >
      <span v-if="cards_query.isLoading.value">Loading…</span>
    </div>
  </div>
</template>
