<template>
  <div data-testid="study-modal-track" class="flex flex-col items-center">
    <div
      class="scroll-hidden border-grey flex h-8 max-w-189 shrink-0 items-center gap-1 overflow-x-auto border-x
        border-dashed px-1"
    >
      <button
        v-for="card in studySession?.cards"
        :key="card.id"
        class="aspect-card bg-parchment rounded-1.5 group flex w-4.75 min-w-4.75 cursor-pointer justify-center
          transition-[all] duration-100 hover:min-w-6 focus:outline-none"
        :class="{
          '!bg-purple-dark !min-w-6': isActive(card),
          '!bg-purple': isStudied(card),
          '!bg-grey-light': isFailed(card)
        }"
        @click="onClickCard(card)"
      >
        <div class="hidden group-hover:block">
          <ui-kit:tooltip
            :text="isStudied(card) || isActive(card) || isFailed(card) ? card.front_text : '?'"
            open
          />
        </div>
      </button>
    </div>

    <div data-testid="study-modal-track__count">
      <p class="text-brown-dark text-base">
        {{ (studySession?.activeCard?.order ?? 0) + 1
        }}<span class="text-xs">/{{ studySession?.cards?.length }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { StudySession } from './index.vue'

const emit = defineEmits<{
  (e: 'cardClicked', card: Card): void
}>()

const studySession = inject<StudySession>('studySession')

function isStudied(card: Card) {
  return studySession?.studiedCardIds.has(card.id!)
}

function isFailed(card: Card) {
  return studySession?.failedCardIds.has(card.id!)
}

function isActive(card: Card) {
  return card.id === studySession?.activeCard?.id
}

function isNext(card: Card) {
  const lastStudiedOrder = studySession?.lastStudiedCard?.order

  if (lastStudiedOrder === undefined) return false
  if (lastStudiedOrder === studySession?.cards.length) return false

  return card.order === lastStudiedOrder + 1
}

function onClickCard(card: Card) {
  if (isStudied(card) || isFailed(card) || isNext(card)) {
    emit('cardClicked', card)
  }
}
</script>
