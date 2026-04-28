<script lang="ts" setup>
import Card from '@/components/card/index.vue'
import UiRadio from '@/components/ui-kit/radio.vue'
import GridItemMenu from './grid-item-menu.vue'

const { card, side, is_selecting } = defineProps<{
  card: Card
  is_selecting: boolean
  side: 'front' | 'back'
  selected: boolean
  card_attributes?: DeckCardAttributes
}>()

const emit = defineEmits<{
  (e: 'card-selected'): void
}>()
</script>

<template>
  <div class="group relative w-full max-w-78.5" data-testid="grid-item-wrapper">
    <div
      class="grid-item relative aspect-card w-full overflow-hidden [content-visibility:auto] [contain-intrinsic-size:auto_220px]"
    >
      <card
        v-bind="card"
        :class="{
          'cursor-pointer hover:[&>.card-face]:border-purple-500!': is_selecting
        }"
        class="grid-item__card"
        size="xl"
        :side="side"
        :card_attributes="card_attributes"
      >
        <div v-if="is_selecting" class="absolute top-0 right-0">
          <ui-radio :checked="selected" @click.stop="emit('card-selected')" />
        </div>
      </card>
    </div>

    <grid-item-menu v-if="!is_selecting" />
  </div>
</template>

<style>
.grid-item .grid-item__card {
  --scale: 0.75;

  position: absolute;
  inset: 0;

  width: calc(100% / var(--scale));
  height: calc(100% / var(--scale));

  transform-origin: top left;
  transform: scale(var(--scale));
}
</style>
