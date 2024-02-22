<template>
  <div :class="color">
    <Icon></Icon>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  fill: String
})

const Icon = defineAsyncComponent(() => import(`../../assets/svgs/${props.src}.svg`))

const color = {
  'text-gray-300': props.fill === 'grey'
}
</script>
