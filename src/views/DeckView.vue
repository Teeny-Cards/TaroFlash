<template>
  <div class="flex p-8 gap-8">
    <section class="flex flex-col gap-8">
      <TeenyCard></TeenyCard>
      <div class="flex flex-col gap-2">
        <h1 class="text-xl font-semibold text-gray-400">{{ deck?.title }}</h1>
        <h2 class="text-gray-400">{{ deck?.description }}</h2>
      </div>
      <TeenyButton color="danger" @onClick="deleteDeck">Delete</TeenyButton>
    </section>
    <section
      class="bg-white grid grid-cols-deck-desktop gap-8 rounded-md w-full shadow-md p-20 relative"
    >
      <TeenyCard v-for="(card, index) in cards" :key="index" size="small">
        <p class="text-xl font-semibold text-gray-500">{{ card.frontText }}</p>
      </TeenyCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import TeenyCard from '@/components/TeenyCard.vue'
import { useDeckStore } from '@/stores/decks'
import { onMounted, ref } from 'vue'
import { getDeckById, deleteDeckById } from '@/services/deckService'
import { getCardsByDeckID, deleteCardsByDeckID } from '../services/cardService'
import TeenyButton from '@/components/TeenyButton.vue'
import router from '@/router'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
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

async function deleteDeck(): Promise<void> {
  await deleteCardsByDeckID(props.id)
  await deleteDeckById(props.id)
  router.push({ name: 'dashboard' })
}
</script>
