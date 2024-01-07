<template>
  <div>
    <div v-for="(deck, index) in decks" :key="index">
      {{ deck.title }}
    </div>
  </div>
</template>

<script setup lang="ts">
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
