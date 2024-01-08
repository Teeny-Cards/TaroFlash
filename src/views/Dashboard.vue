<template>
  <div class="h-full flex flex-col gap-4 p-8 bg-white shadow-md">
    <h1 class="text-2xl font-semibold">Decks</h1>
    <div class="flex gap-4">
      <div v-for="(deck, index) in decks" :key="index">
        <TeenyDeck :deck="deck" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TeenyDeck from '@/components/TeenyDeck.vue'
import { onMounted } from 'vue'
import { getUserDecks } from '../services/deckService'
import { useDeckStore } from '@/stores/decks'
import { storeToRefs } from 'pinia'

onMounted(() => {
  getUserDecks()
})

const deckStore = useDeckStore()
const { decks } = storeToRefs(deckStore)
</script>
