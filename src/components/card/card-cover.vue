<script setup lang="ts">
import { computed } from 'vue'
import { coverBindings } from '@/utils/cover'

const { cover } = defineProps<{
  cover?: DeckCover
}>()

const bindings = computed(() => coverBindings(cover, { fallbackTheme: 'purple-500' }))
</script>

<template>
  <div
    data-testid="card-cover"
    v-bind="bindings"
    class="card-cover bgx-(--theme-neutral) bg-(--theme-primary)"
  />
</template>

<style>
.card-cover {
  width: 100%;
  height: 100%;
  border-radius: var(--face-radius);
  box-sizing: border-box;
}
</style>
