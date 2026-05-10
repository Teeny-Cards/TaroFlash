<script setup lang="ts">
import CoverDesignerToolbar from './cover-designer/index.vue'
import CardDesignerToolbar from './card-designer-toolbar.vue'

type TabDesignProps = {
  cover: DeckCover
  card_attributes: DeckCardAttributes
  side: CardSide
}

defineProps<TabDesignProps>()
</script>

<template>
  <div data-testid="tab-design" class="flex flex-col items-center gap-3">
    <div data-testid="tab-design__toolbar">
      <cover-designer-toolbar v-if="side === 'cover'" :config="cover" />
      <card-designer-toolbar v-else-if="side === 'front'" :attributes="card_attributes.front" />
      <card-designer-toolbar v-else :attributes="card_attributes.back" />
    </div>
  </div>
</template>
