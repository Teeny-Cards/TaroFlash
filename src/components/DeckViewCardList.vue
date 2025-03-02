<template>
  <div tid="deck-view__card-list" class="flex gap-2 flex-col w-full">
    <template v-for="card in cards" :key="card.id">
      <DeckViewCardListItem
        tid="list-item"
        :card="card"
        @click="$emit('edit-card', card)"
        @moveCard="(card: Card) => $emit('move-card', card)"
        @deleteCard="(card: Card) => $emit('delete-card', card)"
      />
      <div class="w-full border-dashed border-b border-b-grey"></div>
    </template>
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
