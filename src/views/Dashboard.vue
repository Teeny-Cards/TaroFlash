<template>
  <div class="h-full flex flex-col gap-4">
    <h1 class="text-2xl font-semibold text-grey-dark">All Decks</h1>
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
import { fetchUserDecks } from '@/services/deckService'
import { useMessageStore } from '@/stores/message'
import TeenyDeck from '@teeny/TeenyDeck.vue'

const loading = ref(true)
const messageStore = useMessageStore()
const decks = ref<Deck[]>([])

onMounted(async () => {
  try {
    decks.value = await fetchUserDecks()
    loading.value = false
  } catch (e: any) {
    messageStore.error(e.message)
  }
})
</script>
