<template>
  <div class="flex flex-col gap-4">
    <RouterLink :to="`/deck/${deck.id}`">
      <Card size="small" class="relative overflow-hidden">
        <div v-if="deck.image_url" class="absolute inset-0">
          <img
            :src="deck.image_url"
            alt="Deck Image preview"
            class="h-full w-full object-cover"
          /></div
      ></Card>
    </RouterLink>
    <div>
      <h2 class="text-md font-semibold text-gray-400">{{ deck.title }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/card.vue'
import { RouterLink } from 'vue-router'

defineProps<{ deck: Deck }>()
</script>
