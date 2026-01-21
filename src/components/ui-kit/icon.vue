<script setup lang="ts">
import { type Component, computed } from 'vue'

const { src } = defineProps<{
  src: string
}>()

// Import all icons
const icons: Record<string, Component> = import.meta.glob('../../assets/icons/*.svg', {
  eager: true,
  import: 'default'
})

const iconComponent = computed(() => {
  const icon = icons[`../../assets/icons/${src}.svg`]
  if (!icon) console.warn(`Missing icon: ${src}`)

  return icon
})
</script>

<template>
  <component data-testid="ui-kit-icon" :is="iconComponent" :alt="src" />
</template>
