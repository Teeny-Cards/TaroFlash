<template>
  <div
    v-if="open"
    class="absolute top-16 right-0 w-60 h-90 bg-parchment-dark shadow-apps rounded-16"
  ></div>
</template>

<script setup lang="ts">
defineProps({
  open: Boolean
})
</script>
