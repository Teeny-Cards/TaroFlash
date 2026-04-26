<script setup lang="ts">
import ListItem from './list-item.vue'
import { inject, useTemplateRef } from 'vue'
import { type CardListController } from '@/composables/card-editor/card-list-controller'

const { all_cards, hasNextPage, isLoading, observeSentinel } =
  inject<CardListController>('card-editor')!

const sentinel = useTemplateRef<HTMLElement>('sentinel')

observeSentinel(sentinel)
</script>

<template>
  <div
    data-testid="card-list"
    class="w-full md:h-full md:overflow-auto pb-24 flex flex-col items-center"
  >
    <list-item
      v-for="(card, index) in all_cards"
      :key="card.client_id"
      :index="index"
      :card="card"
      :duplicate="card.is_duplicate ?? false"
    >
    </list-item>
    <div
      v-if="hasNextPage"
      ref="sentinel"
      data-testid="card-list__sentinel"
      class="w-full py-6 flex items-center justify-center text-brown-500"
    >
      <span v-if="isLoading">Loading…</span>
    </div>
    <slot></slot>
  </div>
</template>
