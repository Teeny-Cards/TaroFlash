<template>
  <Image :teeny-image="src" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  }
})

const Image = defineAsyncComponent(() => import(`../../assets/items/${props.src}.svg`))
</script>
