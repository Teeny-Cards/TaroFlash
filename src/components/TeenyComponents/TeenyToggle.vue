<template>
  <div
    class="w-12 rounded-full flex items-center p-1 cursor-pointer transition-colors"
    :class="{ 'bg-leaf-dark': checked, 'bg-white': !checked }"
  >
    <div
      class="w-5 h-5 rounded-full transition-all"
      :class="{ 'transform translate-x-full bg-white': checked, 'bg-grey': !checked }"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  checked: Boolean
})
</script>
