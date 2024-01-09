<template>
  <div v-for="(card, index) in cards" :key="index">{{ card.frontText }} : {{ card.backText }}</div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  cards: {
    type: Object as PropType<Card[]>,
    required: true
  }
})
</script>
