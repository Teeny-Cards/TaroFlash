<template>
  <div>{{ deck?.title }}</div>
  <div v-for="(card, index) in cards" :key="index">{{ card.frontText }} | {{ card.backText }}</div>
</template>

<script setup lang="ts">
import { useDeckStore } from '@/stores/decks'
import { onMounted, ref } from 'vue'
import { getDeckById } from '../services/deckService'
import { getCardsByDeckID } from '../services/cardService'

const props = defineProps({
  id: String
})

const deckStore = useDeckStore()
const deck = ref<Deck | null>(null)
const cards = ref<Card[]>([])

onMounted(async () => {
  getDeck()
  getCards()
})

async function getDeck(): Promise<void> {
  if (!props.id) {
    //TODO: Reroute back to dashboard or show 'no deck' UI
    console.error('No deck ID provided')
    return
  }

  let cachedDeck = deckStore.getDeckById(props.id)

  if (cachedDeck) {
    deck.value = cachedDeck
  } else {
    const fetchedDeck = await getDeckById(props.id)

    if (fetchedDeck) {
      deck.value = fetchedDeck
    } else {
      //TODO: Show error state
      console.log('Deck not found')
    }
  }
}

async function getCards(): Promise<void> {
  if (props.id) {
    cards.value = await getCardsByDeckID(props.id)
  }
}
</script>
