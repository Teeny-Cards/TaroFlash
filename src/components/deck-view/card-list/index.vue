<script lang="ts" setup>
import { ref } from 'vue'
import ListItem from './list-item.vue'
import { type NavigationData } from './list-item.vue'

const { deck, editing } = defineProps<{ deck: Deck; editing: boolean }>()

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

  if (newIndex >= 0 && newIndex < (deck.cards?.length ?? Infinity)) {
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
</script>

<template>
  <div data-testid="card-list" class="divide-brown-500 flex w-full flex-col">
    <template v-for="(card, index) in deck.cards" :key="card.id">
      <list-item
        :front_text="card.front_text"
        :back_text="card.back_text"
        :editing="editing"
        :selection-start="selection_start"
        :selected-column="selected_column"
        :focused="selected_card_index === index"
        @focused="(direction) => onFocus(direction, index)"
        @navigated="onNavigate"
      />
      <ui-kit:divider dashed />
    </template>
  </div>
</template>
