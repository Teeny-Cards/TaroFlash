<template>
  <img v-if="imageUrl" :src="imageUrl" :alt="src" class="h-full w-full" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const { src } = defineProps<{ src: string }>()

const imageUrl = ref<string | null>(null)

const modules = import.meta.glob('../../assets/images/*.{png,jpg,jpeg,svg}', {
  import: 'default' // returns URL as default export
})

onMounted(async () => {
  const matchingKey = Object.keys(modules).find((key) => key.includes(src))

  if (!matchingKey) {
    throw new Error(`No image found for: ${src}`)
  }

  const image = await modules[matchingKey]() // lazy load!
  imageUrl.value = image as string
})
</script>
