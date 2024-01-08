<template>
  <div class="flex p-8 gap-8">
    <section class="flex flex-col gap-8">
      <div class="w-[284px] h-[327px] rounded-[36px] bg-white shadow-lg"></div>
      <div class="flex flex-col gap-2">
        <h1 class="text-xl font-semibold text-gray-400">{{ deck?.title }}</h1>
        <h2 class="text-gray-400">{{ deck?.description }}</h2>
      </div>
      <TeenyButton />
    </section>
    <section
      class="bg-white rounded-md w-full flex flex-col gap-8 justify-center items-center shadow-md p-20 relative"
    >
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="flex gap-8 justify-around items-center w-full"
      >
        <TeenyCard :order="1" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import TeenyButton from '../components/TeenyButton.vue'
import TeenyCard from '@/components/TeenyCard.vue'
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
