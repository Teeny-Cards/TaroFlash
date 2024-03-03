<template>
  <div teeny-icon :class="color">
    <Icon :class="size"></Icon>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  fill: String,
  size: String
})

const Icon = defineAsyncComponent(() => import(`../../assets/svgs/${props.src}.svg`))

const color = {
  'text-gray': props.fill === 'grey'
}

const size = computed(() => {
  switch (props.size) {
    case 'large':
      return 'w-6 h-6'
    case 'small':
      return 'w-4 h-4'
    case 'teeny':
      return 'w-3 h-3'
    default: // base
      return 'w-5 h-5'
  }
})
</script>
