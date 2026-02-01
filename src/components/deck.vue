<script setup lang="ts">
defineProps<{ deck: Deck }>()
</script>

<template>
  <div data-testid="deck" class="relative cursor-pointer">
    <div
      class="aspect-card w-48 rounded-10 ring-6 border-3 border-purple-400 ring-purple-400
        bg-purple-400"
    ></div>

    <div class="absolute w-full -bottom-2.5 bg-brown-300 px-3 py-2 rounded-4.5">
      <h2 class="text-lg text-center text-brown-700">{{ deck.title }}</h2>
    </div>
  </div>
</template>
