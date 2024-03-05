<template>
  <div deck-view__card-list class="flex flex-col w-full">
    <div
      deck-view__card-list__item
      v-for="card in cards"
      :key="card.id"
      class="px-2.5 py-4 border-b border-b-grey w-full border-dashed flex items-center justify-between"
    >
      <DeckViewCardListItem :card="card" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import DeckViewCardListItem from '@/components/DeckViewCardListItem.vue'

defineProps({
  cards: Object as PropType<Card[]>
})
</script>
