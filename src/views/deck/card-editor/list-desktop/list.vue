<script setup lang="ts">
import ListItem from './list-item.vue'
import TextEditorToolbar from '@/components/text-editor-toolbar/index.vue'
import { inject } from 'vue'
import { type CardBulkEditor } from '@/composables/card-bulk-editor'

const { all_cards, isDuplicate } = inject<CardBulkEditor>('card-editor')!
</script>

<template>
  <div data-testid="card-list" class="w-full pt-6 flex flex-col items-center">
    <list-item
      v-for="(card, index) in all_cards"
      :key="card.id"
      :index="index"
      :card="card"
      :duplicate="isDuplicate(card)"
    />

    <text-editor-toolbar inactive_classes="transform translate-y-25" hide_on_mobile />
    <slot></slot>
  </div>
</template>
