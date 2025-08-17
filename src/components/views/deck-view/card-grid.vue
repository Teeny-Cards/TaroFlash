<script setup lang="ts">
import Card from '@/components/card/index.vue'

defineProps<{
  cards: Card[]
}>()
</script>

<template>
  <div data-testid="card-grid" class="grid grid-cols-[repeat(auto-fit,192px)] gap-4 py-3">
    <card v-for="card in cards" :key="card.id" :front_text="card.front_text" />
  </div>
</template>
