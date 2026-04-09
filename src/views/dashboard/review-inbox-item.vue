<script setup lang="ts">
defineProps<{
  deck: Deck
}>()
</script>

<template>
  <div
    class="flex items-center gap-x-3.5 w-full bg-green-600 p-2 rounded-4 text-brown-100 cursor-pointer relative"
  >
    <div class="bg-brown-300 h-10 w-10 rounded-10"></div>
    <h3 class="text-lg">{{ deck.title }}</h3>
    <div class="absolute right-0 -top-2 px-4 py-1 bg-brown-300 rounded-3 text-brown-700">
      {{ deck.due_count }} due
    </div>
  </div>
</template>
