<template>
  <div class="flex flex-col gap-4">
    <RouterLink :to="`/deck/${deck.id}`">
      <TeenyCard size="small" />
    </RouterLink>
    <div>
      <h2 class="text-md font-semibold text-gray-400">{{ deck.title }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import TeenyCard from '@/components/TeenyCard.vue'
import { RouterLink } from 'vue-router'

defineProps<{ deck: Deck }>()
</script>
