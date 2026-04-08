<script setup lang="ts">
type DeckSize = '2xl' | 'xl' | 'lg' | 'base' | 'sm'

const { deck, size = 'base' } = defineProps<{ deck: Deck; size?: DeckSize; hide_title?: boolean }>()
</script>

<template>
  <div
    data-testid="deck"
    class="deck-container relative cursor-pointer h-min"
    :class="`deck-container--${size}`"
  >
    <div
      class="aspect-card w-(--deck-width) rounded-(--deck-radius) ring-6 border-3 border-purple-400 ring-purple-400 bg-purple-400"
    ></div>

    <div v-if="!hide_title" class="absolute w-full -bottom-2.5 bg-brown-300 px-3 py-2 rounded-4.5">
      <h2 class="text-lg text-center text-brown-700">{{ deck.title }}</h2>
    </div>
  </div>
</template>

<style>
.deck-container {
  --deck-width: 192px;
  --deck-radius: 40px;
}
.deck-container--sm {
  --deck-width: 138px;
  --deck-radius: 30px;
}
.deck-container--base {
  --deck-width: 192px;
  --deck-radius: 40px;
}
.deck-container--lg {
  --deck-width: 260px;
  --deck-radius: 54px;
}
.deck-container--xl {
  --deck-width: 314px;
  --deck-radius: 58px;
}
.deck-container--2xl {
  --deck-width: 380px;
  --deck-radius: 70px;
}
</style>
