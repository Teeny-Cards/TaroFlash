<template>
  <button class="text-white rounded-xl p-3" :class="color" @click="$emit('onClick')">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    validator(value: string) {
      return ['interaction', 'danger'].includes(value)
    }
  }
})

const color = computed(() => {
  switch (props.color) {
    case 'interaction':
      return 'bg-green-400'
    case 'danger':
      return 'bg-red-400'
    default:
      return 'bg-green-400'
  }
})
</script>
