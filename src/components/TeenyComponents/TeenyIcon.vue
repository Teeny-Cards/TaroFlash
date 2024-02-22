<template>
  <div :style="{ color: fill }">
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
</script>
