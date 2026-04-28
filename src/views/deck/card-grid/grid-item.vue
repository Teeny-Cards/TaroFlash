<script lang="ts" setup>
import Card from '@/components/card/index.vue'
import UiRadio from '@/components/ui-kit/radio.vue'
import GridItemMenu from './grid-item-menu.vue'
import { emitSfx } from '@/sfx/bus'
import { ref } from 'vue'

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

const active_side = ref(side)

function onCardClick() {
  if (is_selecting) return
  active_side.value = active_side.value === 'front' ? 'back' : 'front'
  emitSfx(active_side.value === 'back' ? 'ui.transition_up' : 'ui.transition_down')
}
</script>

<template>
  <div data-testid="grid-item" class="grid-item relative aspect-card w-full group">
    <card
      v-bind="card"
      :class="{
        'hover:[&>.card-face]:border-purple-500!': is_selecting
      }"
      class="grid-item__card cursor-pointer"
      size="xl"
      :side="active_side"
      :card_attributes="card_attributes"
      @click="onCardClick"
    >
      <div v-if="is_selecting" class="absolute top-0 right-0">
        <ui-radio :checked="selected" @click.stop="emit('card-selected')" />
      </div>
    </card>

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
