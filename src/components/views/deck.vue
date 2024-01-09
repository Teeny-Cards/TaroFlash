<template>
  <div class="flex p-8 gap-8">
    <section class="flex flex-col gap-8">
      <TeenyCard></TeenyCard>
      <div class="flex flex-col gap-2">
        <h1 class="text-xl font-semibold text-gray-400">{{ title }}</h1>
        <h2 class="text-gray-400">{{ description }}</h2>
      </div>
      <TeenyButton color="danger" @onClick="$emit('deleteDeck')">Delete</TeenyButton>
    </section>
    <section
      class="bg-white grid grid-cols-deck-desktop gap-8 rounded-md w-full shadow-md p-20 relative"
    >
      <TeenyButton @onClick="$emit('study')">Study</TeenyButton>
      <TeenyCard v-for="(card, index) in cards" :key="index" size="small">
        <p class="text-xl font-semibold text-gray-500">{{ card.frontText }}</p>
      </TeenyCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  title: String,
  description: String,
  cards: {
    type: Object as PropType<Card[]>,
    required: true
  }
})
</script>
