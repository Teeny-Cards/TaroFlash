<script setup lang="ts">
import { type StudyCard, type StudyMode } from '@/composables/study-session'
import { computed } from 'vue'

const { cards, activeCard, previewCard, mode } = defineProps<{
  cards: StudyCard[]
  mode: StudyMode
  activeCard: Card | undefined
  previewCard: Card | undefined
}>()

const emit = defineEmits<{
  (e: 'card-clicked', card: StudyCard): void
}>()

const current_card = computed(() => {
  if (mode === 'studying') return activeCard
  if (mode === 'previewing') return previewCard
  return undefined
})

function isActive(card: StudyCard) {
  return card.id === activeCard?.id
}

function isPreviewing(card: StudyCard) {
  return card.id === previewCard?.id
}

function cardState(card: StudyCard) {
  if (isActive(card)) return 'active'
  if (isPreviewing(card)) return 'previewing'

  return card.state
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
        data-testid="history-track__card"
        :key="card.id"
        class="aspect-card bg-brown-100 rounded-1.5 group flex w-4.75 min-w-4.75 cursor-pointer justify-center
          transition-[all] duration-100 hover:min-w-6 focus:outline-none"
        :class="`history-track__card--${cardState(card)}`"
        @click="onClickCard(card)"
      >
        <!-- <ui-kit:tooltip
          :text="isStudied(card) || isActive(card) || isFailed(card) ? card.front_text : '?'"
        /> -->
      </button>
    </div>

    <div data-testid="history-track__count">
      <p class="text-brown-700 text-lg">
        {{ current_card?.order ?? 0 }}<span class="text-sm">/{{ cards.length }}</span>
      </p>
    </div>
  </div>
</template>

<style>
@reference '@/styles/main.css';

.history-track__card--active {
  @apply !min-w-6 !bg-purple-500;
}
.history-track__card--previewing {
  @apply !min-w-6 !bg-purple-500;
}
.history-track__card--passed {
  @apply !bg-purple-400;
}
.history-track__card--failed {
  @apply !bg-grey-300;
}
</style>
