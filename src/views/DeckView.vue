<template>
  <Study v-if="studying" :cards="cards"></Study>
  <Deck
    v-else
    :id="id"
    :title="deck?.title"
    :description="deck?.description"
    :cards="cards"
    @study="onStudyClicked"
    @deleteDeck="deleteDeck"
  />
</template>

<script setup lang="ts">
import Deck from '@/components/views/deck.vue'
import Study from '@/components/views/study.vue'
import { useDeckStore } from '@/stores/decks'
import { onMounted, ref } from 'vue'
import { getDeckById, deleteDeckById } from '@/services/deckService'
import { getCardsByDeckID, deleteCardsByDeckID } from '@/services/cardService'
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
const studying = ref(false)

onMounted(async () => {
  getDeck()
  getCards()
})

function onStudyClicked(): void {
  studying.value = true
}

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
