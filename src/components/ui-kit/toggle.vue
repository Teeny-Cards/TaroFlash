<template>
  <div
    class="flex w-12 cursor-pointer items-center rounded-full p-1 transition-colors"
    :class="{ 'bg-green-400': checked, 'bg-white': !checked }"
  >
    <div
      class="h-5 w-5 rounded-full transition-all"
      :class="{ 'translate-x-full transform bg-white': checked, 'bg-grey': !checked }"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  checked: Boolean
})
</script>
