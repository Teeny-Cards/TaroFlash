<script setup lang="ts">
import { useAudio } from '@/composables/audio'
import GridItem from './grid-item.vue'
import { type EditableCardKey, type EditableCardValue } from '@/composables/card-bulk-editor'

const {
  mode,
  activeCardId,
  side = 'front'
} = defineProps<{
  cards: Card[]
  mode: 'edit' | 'view' | 'select'
  side?: 'front' | 'back'
  activeCardId?: number
  selectedCardIds?: number[]
}>()

const emit = defineEmits<{
  (e: 'card-added'): void
  (e: 'card-activated', id: number): void
  (e: 'card-deactivated', id: number): void
  (e: 'card-selected', id: number): void
  (e: 'card-deleted', id: number): void
  (e: 'card-updated', id: number, column: EditableCardKey, value: EditableCardValue): void
  (
    e: 'card-image-updated',
    card_id: number | undefined,
    side: 'front' | 'back',
    file: File | undefined
  ): void
}>()

const audio = useAudio()

function onCardMouseEnter(id: number) {
  if (mode !== 'edit' || activeCardId === id) return
  audio.play('click_04')
}

function onCardImageUpdated(
  card_id: number | undefined,
  side: 'front' | 'back',
  file: File | undefined
) {
  emit('card-image-updated', card_id, side, file)
}

function onCardUpdated(id: number, side: 'front' | 'back', text: string) {
  emit('card-updated', id, `${side}_text`, text)
}
</script>

<template>
  <div data-testid="card-grid" class="grid grid-cols-[repeat(auto-fit,192px)] gap-4 py-3">
    <grid-item
      v-for="card in cards"
      :card="card"
      :id="card.id!"
      :mode="mode"
      :side="side"
      :active-card-id="activeCardId"
      :selected="selectedCardIds?.includes(card.id!) ?? false"
      @mouseenter="onCardMouseEnter(card.id!)"
      @card-activated="emit('card-activated', $event)"
      @card-deactivated="emit('card-deactivated', $event)"
      @card-selected="emit('card-selected', card.id!)"
      @card-image-updated="onCardImageUpdated(card.id, side, $event)"
      @card-updated="onCardUpdated(card.id!, side, $event)"
    ></grid-item>
  </div>
</template>
