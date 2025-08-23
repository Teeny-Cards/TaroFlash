<script setup lang="ts">
import { useAudio } from '@/composables/use-audio'
import GridItem from './grid-item.vue'
import { type EditableCardKey, type EditableCardValue } from '@/composables/use-card-bulk-editor'

const {
  mode,
  activeCardIndex,
  side = 'front'
} = defineProps<{
  cards: Card[]
  mode: 'edit' | 'view' | 'select'
  side?: 'front' | 'back'
  activeCardIndex?: number
}>()

const emit = defineEmits<{
  (e: 'card-added'): void
  (e: 'card-activated', index: number): void
  (e: 'card-deactivated', index: number): void
  (e: 'card-selected', index: number): void
  (e: 'card-deleted', index: number): void
  (e: 'card-updated', index: number, column: EditableCardKey, value: EditableCardValue): void
  (
    e: 'card-image-updated',
    card_id: number | undefined,
    side: 'front' | 'back',
    file: File | undefined
  ): void
}>()

const audio = useAudio()

function onCardMouseEnter(index: number) {
  if (mode !== 'edit' || activeCardIndex === index) return
  audio.play('click_04')
}

function onCardImageUpdated(
  card_id: number | undefined,
  side: 'front' | 'back',
  file: File | undefined
) {
  emit('card-image-updated', card_id, side, file)
}

function onCardUpdated(index: number, side: 'front' | 'back', text: string) {
  emit('card-updated', index, `${side}_text`, text)
}
</script>

<template>
  <div data-testid="card-grid" class="grid grid-cols-[repeat(auto-fit,192px)] gap-4 py-3">
    <grid-item
      v-for="(card, index) in cards"
      :card="card"
      :index="index"
      :mode="mode"
      :side="side"
      :active-card-index="activeCardIndex"
      @mouseenter="onCardMouseEnter(index)"
      @card-activated="emit('card-activated', $event)"
      @card-deactivated="emit('card-deactivated', $event)"
      @card-image-updated="onCardImageUpdated(card.id, side, $event)"
      @card-updated="onCardUpdated(index, side, $event)"
    ></grid-item>
  </div>
</template>
