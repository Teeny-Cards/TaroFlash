<script setup lang="ts">
import { type CardEditorMode } from '@/composables/card-editor/card-list-controller'

type TopBarProps = {
  mode: CardEditorMode
}

defineProps<TopBarProps>()
</script>

<template>
  <div data-testid="deck-view__top-bar" class="flex justify-between items-center">
    <slot />
  </div>
</template>
