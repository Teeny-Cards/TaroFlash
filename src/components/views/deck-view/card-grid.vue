<script setup lang="ts">
import Card from '@/components/card.vue'

defineProps<{
  cards: Card[]
}>()
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fit,192px)] gap-4 py-3">
    <card v-for="card in cards" :key="card.id">
      {{ card.front_text }}
    </card>
  </div>
</template>
