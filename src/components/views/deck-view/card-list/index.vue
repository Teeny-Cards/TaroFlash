<script lang="ts" setup>
import { ref } from 'vue'
import ListItem from './list-item.vue'
import { type NavigationData } from './list-item.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { cards } = defineProps<{ cards: Card[] }>()
const emit = defineEmits<{
  (e: 'updated', id: number, prop: 'front_text' | 'back_text', value: string): void
  (e: 'add-card'): void
  (e: 'cards-deleted', ids: number[]): void
}>()

const selected_cards = ref<number[]>([])
const current_card_index = ref<number>(-1)
const current_column = ref<'front' | 'back'>('front')

let selection_start = 0
let navigating = false

function onNavigate(data: NavigationData) {
  if (navigating) return

  navigating = true

  if (current_card_index.value === undefined || current_card_index.value < 0) return

  const newIndex =
    data.direction === 'up' ? current_card_index.value - 1 : current_card_index.value + 1

  if (newIndex >= 0 && newIndex < (cards.length ?? Infinity)) {
    selection_start = data.selection_start ?? 0
    current_card_index.value = newIndex
  }

  requestAnimationFrame(() => {
    navigating = false
  })
}

function onFocus(direction: 'left' | 'right', index: number) {
  if (direction === 'left') {
    current_column.value = 'front'
  } else {
    current_column.value = 'back'
  }

  current_card_index.value = index
}

function onUpdated(id: number, prop: 'front_text' | 'back_text', value: string) {
  emit('updated', id, prop, value)
}

function onDeleteCard(id: number) {
  selected_cards.value.push(id)
  emit('cards-deleted', selected_cards.value)

  selected_cards.value = []
}
</script>

<template>
  <div
    data-testid="card-list__empty-state"
    v-if="!cards.length"
    class="text-grey-500 flex h-50 flex-col items-center justify-center gap-4"
  >
    <span>{{ t('deck-view.empty-state.no-cards') }}</span>
    <ui-kit:button icon-left="add" @click="emit('add-card')">Add Card</ui-kit:button>
  </div>

  <div v-else data-testid="card-list" class="relative flex w-full flex-col">
    <template v-for="(card, index) in cards" :key="card.id">
      <list-item
        :card="card"
        :editing="current_card_index === index"
        :selection-start="selection_start"
        :selected-column="current_column"
        :focused="current_card_index === index"
        @focusin="(direction) => onFocus(direction, index)"
        @focusout="current_card_index = -1"
        @navigated="onNavigate"
        @updated="onUpdated"
        @deleted="onDeleteCard"
      />

      <ui-kit:divider v-if="index < cards.length - 1" dashed />
    </template>

    <!-- <ui-kit:button
      v-if="editing"
      data-testid="card-list__add-card-button"
      icon-only
      icon-left="add"
      class="absolute top-3 -right-8"
      @click="emit('add-card')"
    /> -->
  </div>
</template>
