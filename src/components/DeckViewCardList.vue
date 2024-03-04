<template>
  <div deck-view__card-list class="flex flex-col w-full">
    <div
      deck-view__card-list__item
      v-for="card in cards"
      :key="card.id"
      class="px-2.5 py-4 border-b border-b-grey w-full border-dashed flex items-center justify-between"
    >
      <div class="flex items-center gap-6">
        <TeenyCard size="tiny" />
        {{ card.frontText }}
      </div>
      {{ card.backText }}
      <div class="w-6 h-6 rounded-full bg-grey-light"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import TeenyCard from '@/components/TeenyCard.vue'

defineProps({
  cards: Object as PropType<Card[]>
})
</script>
