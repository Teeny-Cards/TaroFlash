<template>
  <div class="h-full flex flex-col gap-4 p-8 bg-white shadow-md">
    <h1 class="text-2xl font-semibold">Decks</h1>
    <div class="flex gap-4">
      <div v-if="loading">Loading</div>
      <div v-else v-for="(deck, index) in decks" :key="index">
        <TeenyDeck :deck="deck" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getUserDecks } from '@/services/deckService'
import { useDeckStore } from '@/stores/decks'
import { storeToRefs } from 'pinia'
import TeenyDeck from '@/components/TeenyDeck/TeenyDeck.vue'

const loading = ref(true)
const deckStore = useDeckStore()
const { decks } = storeToRefs(deckStore)

onMounted(async () => {
  const response = await getUserDecks()

  if (response.success) {
    loading.value = false
  } else {
    //TODO: Error Message + Reroute
  }
})
</script>
