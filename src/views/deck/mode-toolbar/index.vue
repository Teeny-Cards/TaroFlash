<script setup lang="ts">
import { type CardEditorMode } from '@/composables/card-editor/card-list-controller'
import ModeView from './mode-view.vue'
import { computed, inject } from 'vue'
import { type CardListController } from '@/composables/card-editor/card-list-controller'

const { mode } = inject<CardListController>('card-editor')!

const toolbarComponent = computed(() => {
  // if (is_selecting) return BulkSelectToolbar
  // if (is_empty) return null
  // if (mode === 'view') return null

  return ModeView
})
</script>

<template>
  <div data-testid="mode-toolbar-container" class="w-full z-10 relative">
    <component :is="toolbarComponent" />
    <div class="bg-brown-100 dark:bg-grey-900 p-2 rounded-5 absolute -inset-2 -z-1"></div>
  </div>
</template>
