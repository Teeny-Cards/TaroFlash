<script setup lang="ts">
import Card from '@/components/card.vue'

defineProps<{
  cards: Card[]
}>()
</script>

<template>
  <div class="grid w-full auto-cols-[138px] grid-flow-col gap-4 pt-3">
    <card v-for="card in cards" :key="card.id" size="small" :revealed="true">
      {{ card.front_text }}
    </card>
  </div>
</template>
