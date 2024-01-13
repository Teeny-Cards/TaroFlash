<template>
  <div class="flex flex-col gap-4">
    <RouterLink :to="`/deck/${deck.id}`">
      <TeenyCard size="small" class="relative overflow-hidden">
        <div v-if="deck.imageURL" class="absolute inset-0">
          <img
            :src="deck.imageURL"
            alt="Deck Image preview"
            class="object-cover w-full h-full"
          /></div
      ></TeenyCard>
    </RouterLink>
    <div>
      <h2 class="text-md font-semibold text-gray-400">{{ deck.title }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{ deck: Deck }>()
</script>
