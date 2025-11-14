<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLogger } from '@/composables/logger'

const { src, size = 'full' } = defineProps<{
  src: string
  size?: 'full' | 'xl' | 'lg' | 'base' | 'sm' | 'xs'
}>()

const imageUrl = ref<string | null>(null)
const logger = useLogger()

const raster = import.meta.glob('../../assets/images/*.{png,jpg,jpeg}', {
  import: 'default'
})

// SVG → force URL
const svgs = import.meta.glob('../../assets/images/*.svg', {
  query: '?url',
  import: 'default'
})

const modules = { ...raster, ...svgs }

onMounted(async () => {
  const matchingKey = findExact(modules, src)

  if (!matchingKey) {
    logger.warn(`No image found for: ${src}`)
    return
  }

  const image = await modules[matchingKey]() // lazy load!
  imageUrl.value = image as string
})

function findExact(mods: Record<string, any>, name: string) {
  const re = new RegExp(`/(?:^|)${name}\\.(png|jpe?g|svg)$`, 'i')
  return Object.keys(mods).find((k) => re.test(k))
}
</script>

<template>
  <img v-if="imageUrl" :src="imageUrl" :alt="src" :class="`ui-kit-image--${size}`" />
</template>

<style>
.ui-kit-image--full {
  height: 100%;
  width: 100%;
}

.ui-kit-image--xl {
  height: 128px;
  width: 128px;
}

.ui-kit-image--lg {
  height: 96px;
  width: 96px;
}

.ui-kit-image--base {
  height: 64px;
  width: 64px;
}

.ui-kit-image--sm {
  height: 48px;
  width: 48px;
}

.ui-kit-image--xs {
  height: 32px;
  width: 32px;
}

.ui-kit-image--2xs {
  height: 16px;
  width: 16px;
}
</style>
