<template>
  <Icon :src="src" :class="iconSize[size]"></Icon>
</template>

<script setup lang="ts">
import { defineComponent, h, type Component } from 'vue'

const { src, size = 'base' } = defineProps<{
  src: string
  size?: '4xl' | '3xl' | '2xl' | 'xl' | 'large' | 'base' | 'small' | 'xs'
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
  '4xl': 'w-16 h-16',
  '3xl': 'w-14 h-14',
  '2xl': 'w-12 h-12',
  xl: 'w-10 h-10',
  large: 'w-8  h-8',
  base: 'w-5 h-5',
  small: 'w-4 h-4',
  xs: 'w-3 h-3'
}
</script>
