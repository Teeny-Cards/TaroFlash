<template>
  <div
    v-if="open"
    class="bg-brown-300 shadow-apps rounded-16 absolute top-16 right-0 h-90 w-60"
  ></div>
</template>

<script setup lang="ts">
defineProps({
  open: Boolean
})
</script>
