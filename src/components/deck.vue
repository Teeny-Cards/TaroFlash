<template>
  <div data-testid="deck" class="relative flex w-max flex-col gap-2.5">
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

    <div
      v-if="numCardsDue"
      class="bg-red ring-parchment absolute -top-3 -right-3 flex h-7.5 w-7.5 items-center justify-center
        rounded-full ring-4"
    >
      <h2 class="text-sm text-white">{{ numCardsDue }}</h2>
    </div>

    <div>
      <h2 class="text-md text-grey">{{ deck.title }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/card.vue'
import { RouterLink } from 'vue-router'

defineProps<{ deck: Deck; numCardsDue?: number }>()
</script>
