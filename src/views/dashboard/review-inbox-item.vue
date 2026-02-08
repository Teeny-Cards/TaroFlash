<script setup lang="ts">
defineProps<{
  deck: Deck
}>()
</script>

<template>
  <div
    class="flex items-center gap-x-3.5 w-full bg-green-600 p-2 rounded-4 text-brown-100
      cursor-pointer"
  >
    <div class="bg-brown-300 h-10 w-10 rounded-10"></div>
    <h3 class="text-lg">{{ deck.title }}</h3>
  </div>
</template>
