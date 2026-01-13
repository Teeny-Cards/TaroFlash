<script lang="ts" setup>
import Card from '@/components/card/index.vue'
import UiRadio from '@/components/ui-kit/radio.vue'
import { type CardEditorMode } from '@/composables/card-bulk-editor'

const { card, side, mode } = defineProps<{
  card: Card
  mode: CardEditorMode
  side: 'front' | 'back'
  selected: boolean
}>()

const emit = defineEmits<{
  (e: 'card-selected'): void
}>()
</script>

<template>
  <div class="grid-item">
    <card
      v-bind="card"
      :class="{
        'cursor-pointer hover:[&>.card-face]:border-purple-500!': mode === 'select'
      }"
      class="grid-item__card"
      size="xl"
      :side="side"
    >
      <div v-if="mode === 'select'" class="absolute top-0 right-0">
        <ui-radio :checked="selected" @click.stop="emit('card-selected')" />
      </div>
    </card>
  </div>
</template>

<style>
.grid-item {
  position: relative;
  aspect-ratio: var(--aspect-card);
  overflow: hidden;

  max-width: 314px;
  width: 100%;
}

.grid-item .grid-item__card {
  --scale: 0.75;

  position: absolute;
  inset: 0;

  /* Make it larger so that after scaling it fits the slot */
  width: calc(100% / var(--scale));
  height: calc(100% / var(--scale));

  transform-origin: top left;
  transform: scale(var(--scale));
}
</style>
