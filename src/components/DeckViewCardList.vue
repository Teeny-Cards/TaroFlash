<template>
  <div deck-view__card-list class="flex flex-col w-full">
    <div
      deck-view__card-list__item
      v-for="card in cards"
      :key="card.id"
      class="px-2.5 py-4 border-b border-b-grey w-full border-dashed flex items-center justify-between cursor-pointer hover:bg-grey-light"
      @click="$emit('edit-card', card)"
    >
      <DeckViewCardListItem
        :card="card"
        @moveCard="(card: Card) => $emit('move-card', card)"
        @deleteCard="(card: Card) => $emit('delete-card', card)"
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
  (e: 'edit-card', card: Card): void
  (e: 'move-card', card: Card): void
  (e: 'delete-card', card: Card): void
}>()
</script>
