<script lang="ts" setup>
import ListItem from './list-item.vue'
import { useI18n } from 'vue-i18n'
import { type EditableCardValue, type EditableCardKey } from '@/composables/card-bulk-editor'
import UiButton from '@/components/ui-kit/button.vue'
import UiDivider from '@/components/ui-kit/divider.vue'
import { type CardEditorMode } from '@/composables/card-bulk-editor'

const { mode, activeCardId, cards } = defineProps<{
  cards: Card[]
  activeCardId?: number
  selectedCardIds: number[]
  mode: CardEditorMode
}>()

const emit = defineEmits<{
  (e: 'card-added'): void
  (e: 'card-activated', id: number): void
  (e: 'card-deactivated', id: number): void
  (e: 'card-selected', id: number): void
  (e: 'card-deleted', id: number): void
  (e: 'card-moved', id: number): void
  (e: 'card-updated', id: number, column: EditableCardKey, value: EditableCardValue): void
  (e: 'card-closed'): void
}>()

const { t } = useI18n()

function onCardUpdated(id: number, column: EditableCardKey, value: EditableCardValue) {
  emit('card-updated', id, column, value)
}
</script>

<template>
  <div
    data-testid="card-list__empty-state"
    v-if="!cards.length"
    class="text-grey-500 flex h-50 flex-col items-center justify-center gap-4"
  >
    <span>{{ t('deck-view.empty-state.no-cards') }}</span>
    <ui-button icon-left="add" @click="emit('card-added')">
      {{ t('deck-view.add-card') }}
    </ui-button>
  </div>

  <div v-else data-testid="card-list" class="relative flex w-full flex-col">
    <template v-for="(card, index) in cards" :key="card.id">
      <list-item
        :id="`card-${card.id}`"
        :card="card"
        :mode="mode"
        :selected="selectedCardIds.includes(card.id!)"
        :active="activeCardId === card.id"
        @deleted="emit('card-deleted', card.id!)"
        @selected="emit('card-selected', card.id!)"
        @moved="emit('card-moved', card.id!)"
        @activated="emit('card-activated', card.id!)"
        @closed="emit('card-closed')"
        @updated="onCardUpdated"
      />

      <ui-divider v-if="index < cards.length - 1" dashed />
    </template>

    <div class="w-full flex justify-center p-4">
      <ui-button v-if="mode === 'edit'" icon-left="add" class="mt-4" @click="emit('card-added')">
        {{ t('deck-view.add-card') }}
      </ui-button>
    </div>
  </div>
</template>
