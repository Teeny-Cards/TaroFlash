<script setup lang="ts">
import { type CardEditorMode } from '@/composables/card-editor/card-list-controller'
import ModeView from './mode-view.vue'
import { computed } from 'vue'

type TopBarProps = {
  mode: CardEditorMode
  is_empty: boolean
  is_selecting: boolean
}

defineProps<TopBarProps>()

const toolbarComponent = computed(() => {
  // if (is_selecting) return BulkSelectToolbar
  // if (is_empty) return null
  // if (mode === 'view') return null

  return ModeView
})
</script>

<template>
  <component :is="toolbarComponent" />
</template>
