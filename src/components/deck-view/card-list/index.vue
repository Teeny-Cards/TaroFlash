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

const deleteCardConfirmationOpen = ref(false)
const cardsToDelete = ref<number[]>([])

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

function onDeleteCard(id: number) {
  cardsToDelete.value.push(id)
  deleteCardConfirmationOpen.value = true
}

function confirmDeleteCards() {
  emit('cards-deleted', cardsToDelete.value)
  cardsToDelete.value = []
  deleteCardConfirmationOpen.value = false
}

function cancelDeleteCards() {
  cardsToDelete.value = []
  deleteCardConfirmationOpen.value = false
}
</script>

<template>
  <div data-testid="card-list" class="relative flex w-full flex-col">
    <template v-for="(card, index) in cards" :key="card.id">
      <list-item
        :card="card"
        :editing="editing"
        :selection-start="selection_start"
        :selected-column="selected_column"
        :focused="selected_card_index === index"
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

  <ui-kit:modal :open="deleteCardConfirmationOpen">
    <div class="bg-brown-300 rounded-5 shadow-modal flex flex-col gap-8 p-10">
      <div class="flex flex-col gap-2">
        <h1 class="text-grey-700 text-5xl">{{ $t('alert.delete-card') }}</h1>
        <p class="text-grey-700">{{ $t('alert.delete-card.message') }}</p>
      </div>
      <div class="flex w-full gap-2">
        <ui-kit:button variant="muted" icon-left="close" @click="cancelDeleteCards">{{
          $t('common.cancel')
        }}</ui-kit:button>
        <ui-kit:button variant="danger" icon-left="delete" @click="confirmDeleteCards">{{
          $t('common.delete')
        }}</ui-kit:button>
      </div>
    </div>
  </ui-kit:modal>
</template>
