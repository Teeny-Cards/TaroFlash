<script lang="ts" setup>
import ListItem from './list-item.vue'

defineProps<{ deck: Deck }>()
</script>

<template>
  <div
    data-testid="card-list"
    class="divide-brown-light flex w-full flex-col divide-y-1 divide-dashed"
  >
    <list-item v-for="card in deck.cards" :key="card.id" :card="card" />
  </div>
</template>
