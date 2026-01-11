<script setup lang="ts">
defineProps<{
  cards: Card[]
}>()
</script>

<template>
  <div data-testid="card-list" class="relative flex pt-5 w-full flex-col items-center"></div>
</template>
