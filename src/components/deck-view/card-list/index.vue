<script lang="ts" setup>
import { ref } from 'vue'
import ListItem from './list-item.vue'
import { type NavigationData } from './list-item.vue'

const { cards, editing } = defineProps<{ cards: Card[]; editing: boolean }>()
const emit = defineEmits<{
  (e: 'updated', id: number, prop: 'front_text' | 'back_text', value: string): void,
  (e: 'add-card'): void
}>()

const selected_card_index = ref<number>(0)
const selected_column = ref<'front' | 'back'>('front')
let selection_start = 0

let navigating = false
function onNavigate(data: NavigationData) {
  if (navigating) return

  navigating = true

  if (selected_card_index.value === undefined || selected_card_index.value < 0) return

  const newIndex =
    data.direction === 'up' ? selected_card_index.value - 1 : selected_card_index.value + 1

  if (newIndex >= 0 && newIndex < (cards.length ?? Infinity)) {
    selection_start = data.selection_start
    selected_card_index.value = newIndex
  }

  requestAnimationFrame(() => {
    navigating = false
  })
}

function onFocus(direction: 'left' | 'right', index: number) {
  if (direction === 'left') {
    selected_column.value = 'front'
  } else {
    selected_column.value = 'back'
  }

  selected_card_index.value = index
}

function onUpdated(id: number, prop: 'front_text' | 'back_text', value: string) {
  emit('updated', id, prop, value)
}
</script>

<template>
  <div data-testid="card-list" class="divide-brown-500 flex w-full flex-col relative">
    <template v-for="(card, index) in cards" :key="card.id">
      <list-item :card="card" :editing="editing" :selection-start="selection_start" :selected-column="selected_column"
        :focused="selected_card_index === index" @focused="(direction) => onFocus(direction, index)"
        @navigated="onNavigate" @updated="onUpdated" />

      <ui-kit:divider dashed />
    </template>

    <ui-kit:button v-if="editing" icon-only icon-left="add" class="absolute top-3 -right-8" @click="emit('add-card')">
    </ui-kit:button>
  </div>
</template>
