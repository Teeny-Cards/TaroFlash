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
import { useDeckStore } from '@/stores/decks'
import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
import TeenyDeck from '@teeny/TeenyDeck.vue'

const loading = ref(true)
const deckStore = useDeckStore()
const messageStore = useMessageStore()
const { decks } = storeToRefs(deckStore)

onMounted(async () => {
  try {
    await deckStore.fetchUserDecks()
    loading.value = false
  } catch (e: any) {
    messageStore.error(e.message)
  }
})
</script>
