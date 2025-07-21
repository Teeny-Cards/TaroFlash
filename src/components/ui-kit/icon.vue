<template>
  <Icon :src="src" :class="iconSize[size]"></Icon>
</template>

<script setup lang="ts">
import { defineComponent, h, type Component } from 'vue'

type IconSize = 'large' | 'base' | 'small' | 'xs'

const { src, size = 'base' } = defineProps<{
  src: string
  size?: IconSize
}>()

// Import all icons
const icons: Record<string, Component> = import.meta.glob('../../assets/icons/*.svg', {
  eager: true,
  import: 'default'
})

const Icon = defineComponent({
  props: {
    src: { type: String, required: true }
  },
  setup(props) {
    const icon = icons[`../../assets/icons/${props.src}.svg`]
    return () => h(icon)
  }
})

const iconSize: { [key: string]: string } = {
  large: 'w-8  h-8',
  base: 'w-5 h-5',
  small: 'w-4 h-4',
  xs: 'w-3 h-3'
}
</script>
