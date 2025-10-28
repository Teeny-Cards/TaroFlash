<script lang="ts" setup>
import ListItem from './list-item.vue'
import { useI18n } from 'vue-i18n'
import { type EditableCardValue, type EditableCardKey } from '@/composables/card-bulk-editor'
import { onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
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
  (e: 'next-card-activated'): void
  (e: 'card-deactivated', id: number): void
  (e: 'card-selected', id: number): void
  (e: 'card-deleted', id: number): void
  (e: 'card-moved', id: number): void
  (e: 'card-updated', id: number, column: EditableCardKey, value: EditableCardValue): void
}>()

const { t } = useI18n()

const card_list = useTemplateRef('card-list')

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

async function onKeydown(e: KeyboardEvent) {
  if (e.shiftKey && e.key === 'Enter') {
    e.preventDefault()
    emit('next-card-activated')
  }
}

function onCardUpdated(id: number, column: EditableCardKey, value: EditableCardValue) {
  emit('card-updated', id, column, value)
}

watch(
  () => mode,
  (new_mode, old_mode) => {
    if (!activeCardId || (new_mode === 'edit' && old_mode !== 'edit')) return

    const active_card = card_list.value?.querySelector(`#card-${activeCardId}`)
    active_card?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
)
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

  <div v-else ref="card-list" data-testid="card-list" class="relative flex w-full flex-col">
    <template v-for="(card, index) in cards" :key="card.id">
      <list-item
        :id="`card-${card.id}`"
        :card="card"
        :mode="mode"
        :selected="selectedCardIds.includes(card.id!)"
        :active="activeCardId === card.id"
        @focusout="emit('card-deactivated', card.id!)"
        @deleted="emit('card-deleted', card.id!)"
        @selected="emit('card-selected', card.id!)"
        @moved="emit('card-moved', card.id!)"
        @activated="emit('card-activated', card.id!)"
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
