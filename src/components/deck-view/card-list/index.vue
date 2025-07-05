<script lang="ts" setup>
import { ref } from 'vue'
import ListItem from './list-item.vue'
import { type NavigationData } from './list-item.vue'

const { cards, editing } = defineProps<{ cards: Card[]; editing: boolean }>()
const emit = defineEmits<{
  (e: 'updated', id: number, prop: 'front_text' | 'back_text', value: string): void
  (e: 'add-card'): void
  (e: 'cards-deleted', ids: number[]): void
}>()

const selected_cards = ref<number[]>([])
const current_card_index = ref<number>(0)
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
    selection_start = data.selection_start
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
}
</script>

<template>
  <div data-testid="card-list" class="relative flex w-full flex-col">
    <template v-for="(card, index) in cards" :key="card.id">
      <list-item
        :card="card"
        :editing="editing"
        :selection-start="selection_start"
        :selected-column="current_column"
        :focused="current_card_index === index"
        @focused="(direction) => onFocus(direction, index)"
        @navigated="onNavigate"
        @updated="onUpdated"
        @deleted="onDeleteCard(card.id!)"
      />

      <ui-kit:divider dashed />
    </template>

    <ui-kit:button
      v-if="editing"
      icon-only
      icon-left="add"
      class="absolute top-3 -right-8"
      @click="emit('add-card')"
    />
  </div>
</template>
