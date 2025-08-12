<script setup lang="ts">
import { type StudyCard } from '@/composables/use-study-session'

const { cards, currentCard } = defineProps<{
  cards: StudyCard[]
  currentCard: Card | undefined
}>()

const emit = defineEmits<{
  (e: 'card-clicked', card: StudyCard): void
}>()

function isActive(card: StudyCard) {
  return card.id === currentCard?.id
}

function onClickCard(card: StudyCard) {
  emit('card-clicked', card)
}
</script>

<template>
  <div data-testid="history-track" class="flex flex-col items-center">
    <div
      class="scroll-hidden border-grey-500 flex h-8 max-w-189 shrink-0 items-center gap-1 overflow-x-auto
        border-x border-dashed px-1"
    >
      <button
        v-for="card in cards"
        :key="card.id"
        class="aspect-card bg-brown-100 rounded-1.5 group flex w-4.75 min-w-4.75 cursor-pointer justify-center
          transition-[all] duration-100 hover:min-w-6 focus:outline-none"
        :class="{
          '!min-w-6 !bg-purple-500': isActive(card),
          '!bg-purple-400': card.state === 'passed',
          '!bg-grey-300': card.state === 'failed'
        }"
        @click="onClickCard(card)"
      >
        <!-- <ui-kit:tooltip
          :text="isStudied(card) || isActive(card) || isFailed(card) ? card.front_text : '?'"
        /> -->
      </button>
    </div>

    <div data-testid="history-track__count">
      <p class="text-brown-700 text-lg">
        {{ currentCard?.order ?? 0 }}<span class="text-sm">/{{ cards.length }}</span>
      </p>
    </div>
  </div>
</template>
