<script setup lang="ts">
import { computed } from 'vue'
import CoverDesignerToolbar from './cover-designer/index.vue'
import CardDesignerToolbar from './card-designer-toolbar.vue'

type TabDesignProps = {
  cover: DeckCover
  card_attributes: DeckCardAttributes
  side: CardSide
}

const { card_attributes, side } = defineProps<TabDesignProps>()

const card_side_attributes = computed(() =>
  side === 'front' ? card_attributes.front : card_attributes.back
)
</script>

<template>
  <div data-testid="tab-design" class="flex flex-col items-center gap-3">
    <div data-testid="tab-design__toolbar">
      <cover-designer-toolbar v-if="side === 'cover'" :config="cover" />
      <card-designer-toolbar v-else :attributes="card_side_attributes" />
    </div>
  </div>
</template>
