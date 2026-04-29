<script setup lang="ts">
import { computed, inject } from 'vue'
import CardEditor from './card-editor/index.vue'
import CardGrid from './card-grid/index.vue'
import CardImporter from './card-importer.vue'
import {
  primeOverlayBelow,
  slideOverlayUp,
  slideOverlayDown
} from '@/utils/animations/deck-view/card-overlay'
import type { CardListController } from '@/composables/card-editor/card-list-controller'

const editor = inject<CardListController>('card-editor')!

const overlay_component = computed(() => {
  if (editor.mode.value === 'edit') return CardEditor
  if (editor.mode.value === 'import-export') return CardImporter
  return null
})
</script>

<template>
  <div data-testid="deck-view__mode-stack" class="relative grid">
    <card-grid
      data-testid="deck-view__mode-stack__grid"
      class="transition-transform duration-300 ease-out"
      :class="{ 'scale-95': editor.mode.value !== 'view' }"
    />
    <div
      data-testid="deck-view__mode-stack__overlay-clip"
      class="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <Transition
        :css="false"
        mode="out-in"
        @before-enter="primeOverlayBelow"
        @enter="slideOverlayUp"
        @leave="slideOverlayDown"
      >
        <component
          :is="overlay_component"
          v-if="overlay_component"
          class="size-full pointer-events-auto"
        />
      </Transition>
    </div>
  </div>
</template>
