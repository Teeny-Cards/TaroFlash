<script lang="ts" setup>
import ListItem from './list-item.vue'
import ListItemMobile from './list-item-mobile.vue'
import { useI18n } from 'vue-i18n'
import UiButton from '@/components/ui-kit/button.vue'
import { inject, computed } from 'vue'
import { useBreakpoint } from '@/composables/use-breakpoint'
import { type CardBulkEditor } from '@/composables/card-bulk-editor'
import TextEditorToolbar from '@/components/text-editor-toolbar/index.vue'

const { t } = useI18n()
const is_mobile = useBreakpoint('(max-width: 768px)')
const editor = inject<CardBulkEditor>('card-editor')!

const { all_cards: cards, addCard, isDuplicate } = editor

const list_item_component = computed(() => {
  return is_mobile.value ? ListItemMobile : ListItem
})
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

  <div v-else data-testid="card-list" class="card-list" :class="{ 'card-list--mobile': is_mobile }">
    <component
      v-for="(card, index) in cards"
      :is="list_item_component"
      :key="card.id"
      :index="index"
      :card="card"
      :duplicate="isDuplicate(card)"
    />

    <text-editor-toolbar inactive_classes="transform translate-y-25" hide_on_mobile />
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

.card-list--mobile {
  flex-direction: row;
  gap: 1rem;

  padding-top: 1rem;
  overflow-x: auto;
}
</style>
