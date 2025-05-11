<template>
  <div
    v-if="open"
    data-testid="ui-kit-tooltip"
    class="absolute -mt-7 flex -translate-1/2 flex-col items-center"
  >
    <div class="min-h-7 min-w-7 rounded-full bg-white px-3 py-1.5 shadow">
      <p class="text-purple-dark text-xs">{{ text }}</p>
    </div>
    <div class="h-6 border border-dashed border-white shadow"></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  open: Boolean,
  text: String
})
</script>
