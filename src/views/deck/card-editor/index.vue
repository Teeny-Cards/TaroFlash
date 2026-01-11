<script lang="ts" setup>
import ListItem from './list-item.vue'
import ListItemMobile from './list-item-mobile.vue'
import { useI18n } from 'vue-i18n'
import UiButton from '@/components/ui-kit/button.vue'
import { inject, computed } from 'vue'
import { useBreakpoint } from '@/composables/use-breakpoint'
import { type CardBulkEditor } from '@/composables/card-bulk-editor'
import { useToast } from '@/composables/toast'

const { t } = useI18n()
const toast = useToast()
const is_mobile = useBreakpoint('(max-width: 768px)')
const editor = inject<CardBulkEditor>('card-editor')!
const onDeleteCard = inject<(id: number) => void>('on-delete-card')!
const onMoveCard = inject<(id: number) => void>('on-move-card')!

const { all_cards: cards, addCard: upstreamAddCard } = editor

const list_item_component = computed(() => {
  return is_mobile.value ? ListItemMobile : ListItem
})

function isDuplicate(card: Card) {
  const non_empty_cards = cards.value.filter((c) => c.front_text !== '' || c.back_text !== '')

  return (
    non_empty_cards.filter(
      (c) => c.front_text === card.front_text || c.back_text === card.back_text
    ).length > 1
  )
}

async function addCard(left_card_id?: number, right_card_id?: number) {
  try {
    await upstreamAddCard(left_card_id, right_card_id)
  } catch (e: any) {
    toast.error(t('toast.error.add-card'))
  }
}

async function onAppendCard(card_id: number) {
  const other_card = cards.value[cards.value.findIndex((c) => c.id === card_id) + 1]
  await addCard(other_card?.id, card_id)
}

async function onPrependCard(card_id: number) {
  const other_card = cards.value[cards.value.findIndex((c) => c.id === card_id) - 1]
  await addCard(card_id, other_card?.id)
}
</script>

<template>
  <div
    data-testid="card-list__empty-state"
    v-if="!cards.length"
    class="text-grey-500 flex h-50 flex-col items-center justify-center gap-4"
  >
    <span>{{ t('deck-view.empty-state.no-cards') }}</span>
    <ui-button icon-left="add" @click="addCard()">
      {{ t('deck-view.add-card') }}
    </ui-button>
  </div>

  <div v-else data-testid="card-list" class="card-list">
    <component
      v-for="(card, index) in cards"
      :is="list_item_component"
      :key="card.id"
      :index="index"
      :card="card"
      :duplicate="isDuplicate(card)"
      @delete="onDeleteCard"
      @move="onMoveCard"
      @append="onAppendCard"
      @prepend="onPrependCard"
    />

    <slot></slot>
  </div>
</template>

<style>
.card-list {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  padding-top: 1.5rem;
}
</style>
