<template>
  <div deck-view__card-list class="flex flex-col w-full">
    <div
      deck-view__card-list__item
      v-for="(card, index) in cards"
      :key="card.id"
      class="px-2.5 py-4 border-b border-b-grey w-full border-dashed flex items-center justify-between"
      @click="$emit('editCard', index)"
    >
      <DeckViewCardListItem
        :card="card"
        @moveCard="(card: Card) => $emit('moveCard', card)"
        @deleteCard="(card: Card) => $emit('deleteCard', card)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import DeckViewCardListItem from '@/components/DeckViewCardListItem.vue'

defineProps({
  cards: Object as PropType<Card[]>
})

defineEmits<{
  (e: 'editCard', index: number): void
  (e: 'moveCard', card: Card): void
  (e: 'deleteCard', card: Card): void
}>()
</script>
