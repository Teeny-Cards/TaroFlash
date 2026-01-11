<script setup lang="ts">
import ListItem from './list-item-mobile.vue'
import { inject } from 'vue'
import { type CardBulkEditor } from '@/composables/card-bulk-editor'

const { all_cards } = inject<CardBulkEditor>('card-editor')!
</script>

<template>
  <div data-testid="card-list" class="w-full flex gap-1 pt-4 overflow-x-auto">
    <list-item v-for="(card, index) in all_cards" :key="card.id" :index="index" :card="card" />
  </div>
</template>
