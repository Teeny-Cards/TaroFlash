<script setup lang="ts">
import ListItem from './list-desktop/list-item.vue'
import { useI18n } from 'vue-i18n'
import UiButton from '@/components/ui-kit/button.vue'
import { type CardEditorMode } from '@/composables/card-bulk-editor'
import { type TextEditorUpdatePayload } from '@/composables/rich-text-editor'

const { mode, activeCardId, cards } = defineProps<{
  cards: Card[]
  activeCardId?: number
  selectedCardIds: number[]
  mode: CardEditorMode
}>()

const { t } = useI18n()
const emit = defineEmits<{
  (e: 'card-added', left_card_id?: number, right_card_id?: number): void
  (e: 'card-activated', id: number): void
  (e: 'card-deactivated'): void
  (e: 'card-selected', id: number): void
  (e: 'card-deleted', id: number): void
  (e: 'card-moved', id: number): void
  (e: 'card-updated', id: number, side: 'front' | 'back', payload: TextEditorUpdatePayload): void
}>()
</script>

<template>
  <div data-testid="card-list" class="relative flex pt-5 w-full flex-col items-center">
    <list-item
      v-for="(card, index) in cards"
      :key="card.id"
      :id="`card-${card.id}`"
      :index="index"
      :card="card"
      :mode="mode"
      :selected="selectedCardIds.includes(card.id!)"
      :active="activeCardId === card.id"
      :is_duplicate="isDuplicate(card)"
      :active_side="active_side"
      @deleted="emit('card-deleted', card.id!)"
      @selected="emit('card-selected', card.id!)"
      @moved="emit('card-moved', card.id!)"
      @activated="emit('card-activated', card.id!)"
      @deactivated="emit('card-deactivated')"
      @updated="onCardUpdated"
      @side-changed="onSideChanged"
      @add-card="onAddCard(card, $event)"
    />

    <div class="w-full flex justify-center p-4">
      <ui-button v-if="mode !== 'select'" icon-left="add" class="mt-4" @click="emit('card-added')">
        {{ t('deck-view.add-card') }}
      </ui-button>
    </div>

    <slot></slot>
  </div>
</template>
