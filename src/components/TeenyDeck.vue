<template>
  <div class="flex flex-col gap-4">
    <RouterLink
      :to="`/deck/${deck.id}`"
      class="w-card-small aspect-card rounded-[20px] bg-white shadow-lg border border-gray-100 flex gap-2 flex-col justify-center items-center p-3 cursor-pointer"
    ></RouterLink>
    <div>
      <h2 class="text-md font-semibold text-gray-400">{{ deck.title }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{ deck: Deck }>()
</script>
