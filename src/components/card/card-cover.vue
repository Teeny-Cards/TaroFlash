<script setup lang="ts">
import { computed } from 'vue'
import { coverBindings } from '@/utils/cover'
import UiIcon from '@/components/ui-kit/icon.vue'

const { cover } = defineProps<{
  cover?: DeckCover
}>()

const bindings = computed(() => coverBindings(cover, { fallbackTheme: 'purple-500' }))
</script>

<template>
  <div
    data-testid="card-cover"
    v-bind="bindings"
    :data-theme="cover?.bg_color"
    class="card-cover bg-(--theme-primary) flex items-center justify-center text-(--theme-on-primary)"
  >
    <div
      v-if="cover?.icon"
      data-testid="card-cover__icon"
      class="w-1/3 h-1/3 [&>svg]:w-full [&>svg]:h-full text-(--theme-accent)"
    >
      <ui-icon :src="cover.icon" />
    </div>
  </div>
</template>

<style>
.card-cover {
  width: 100%;
  height: 100%;
  border-radius: var(--face-radius);
  box-sizing: border-box;
}
</style>
