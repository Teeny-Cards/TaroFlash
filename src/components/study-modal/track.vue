<template>
  <div data-testid="study-modal-track" class="flex flex-col items-center">
    <div
      class="scroll-hidden border-grey flex max-w-189 shrink-0 gap-1 overflow-x-auto border-x border-dashed px-1 py-2"
    >
      <div
        v-for="card in deck?.cards"
        :key="card.id"
        class="aspect-card bg-parchment rounded-1.5 w-4.75 min-w-4.75"
        :class="{ 'bg-purple-dark': card.id === currentCard?.id }"
      ></div>
    </div>

    <div data-testid="study-modal-track__count">
      <p class="text-brown-dark text-base">
        {{ currentCard?.order }}<span class="text-xs">/{{ deck?.cards?.length }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, type PropType } from 'vue'

defineProps({
  currentCard: Object as PropType<Card>
})

const deck = inject<Deck>('deck')
</script>
