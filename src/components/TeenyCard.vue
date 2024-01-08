<template>
  <div
    class="aspect-card rounded-[36px] bg-white shadow-lg border border-gray-100 flex justify-center items-center p-3"
    :class="width"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    validator(value: string) {
      // The value must match one of these strings
      return ['small', 'base'].includes(value)
    }
  }
})

const width = computed(() => {
  switch (props.size) {
    case 'small':
      return 'w-card-small'
    case 'base':
    default:
      return 'w-card-base'
  }
})
</script>
