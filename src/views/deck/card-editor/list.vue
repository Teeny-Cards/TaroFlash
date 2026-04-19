<script setup lang="ts">
import ListItem from './list-item.vue'
import { inject, useTemplateRef } from 'vue'
import { type CardBulkEditor } from '@/composables/card-bulk-editor'
import { useInfiniteScroll } from '@/composables/use-infinite-scroll'
import { useCardsInDeckInfiniteQuery } from '@/api/cards'

const { all_cards, getKey } = inject<CardBulkEditor>('card-editor')!
const cards_query = inject<ReturnType<typeof useCardsInDeckInfiniteQuery>>('cards-query')!

const sentinel = useTemplateRef<HTMLElement>('sentinel')

useInfiniteScroll(sentinel, () => cards_query.loadNextPage(), {
  enabled: () => cards_query.hasNextPage.value && !cards_query.isLoading.value
})
</script>

<template>
  <div data-testid="card-list" class="w-full pt-6 flex flex-col items-center">
    <list-item
      v-for="(card, index) in all_cards"
      :key="getKey(card)"
      :index="index"
      :card="card"
      :duplicate="card.is_duplicate ?? false"
    >
    </list-item>
    <div
      v-if="cards_query.hasNextPage.value"
      ref="sentinel"
      data-testid="card-list__sentinel"
      class="w-full py-6 flex items-center justify-center text-brown-500"
    >
      <span v-if="cards_query.isLoading.value">Loading…</span>
    </div>
    <slot></slot>
  </div>
</template>
