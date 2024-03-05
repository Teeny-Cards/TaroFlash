<template>
  <div
    class="aspect-card bg-white flex justify-center items-center p-3"
    :class="[cardSize[size], borderRadius[size]]"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: String,
    validator(value: string) {
      return ['large', 'base', 'small', 'xs', 'teeny'].includes(value)
    },
    default: 'base'
  }
})

const cardSize: { [key: string]: string } = {
  teeny: 'w-card-teeny',
  xs: 'w-card-xs',
  small: 'w-card-small',
  base: 'w-card-base',
  large: 'w-card-large'
}

const borderRadius: { [key: string]: string } = {
  teeny: 'rounded-card-teeny',
  xs: 'rounded-card-xs',
  small: 'rounded-card-small',
  base: 'rounded-card-base',
  large: 'rounded-card-large'
}
</script>
