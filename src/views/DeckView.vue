<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <Study v-if="studying" :cards="cards"></Study>
    <Edit
      v-else-if="editing && deck"
      :deck="deck"
      :cards="cards"
      @addCard="onAddCard"
      @saveDeck="updateDeck"
    ></Edit>
    <Deck
      v-else-if="deck"
      :deck="deck"
      :cards="cards"
      @study="onStudyClicked"
      @edit="onEditClicked"
      @deleteDeck="deleteDeck"
    />
  </div>
</template>

<script setup lang="ts">
import Deck from '@/components/views/deck.vue'
import Study from '@/components/views/study.vue'
import Edit from '@/components/views/edit.vue'
import { useDeckStore } from '@/stores/decks'
import { computed, onMounted, ref } from 'vue'
import { getDeckById, deleteDeckById, updateDeckById } from '@/services/deckService'
import { getCardsByDeckID, deleteCardsByDeckID, updateCardsByDeckID } from '@/services/cardService'
import { useRoute } from 'vue-router'
import router from '@/router'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const deckLoading = ref(true)
const cardsLoading = ref(true)

const route = useRoute()
const deckStore = useDeckStore()
const deck = ref<Deck>()
const cards = ref<Card[]>([])

const loading = computed(() => {
  return deckLoading.value || cardsLoading.value
})

const studying = computed(() => {
  return route.query.mode === 'study'
})

const editing = computed(() => {
  return route.query.mode === 'edit'
})

onMounted(async () => {
  getDeck()
  getCards()
})

function onStudyClicked(): void {
  if (cards.value.length > 0) {
    router.push({ name: 'deck', params: { id: props.id }, query: { mode: 'study' } })
  }
}

function onEditClicked(): void {
  router.push({ name: 'deck', params: { id: props.id }, query: { mode: 'edit' } })
}

async function getDeck(): Promise<void> {
  if (!props.id) {
    //TODO: Reroute back to dashboard or show 'no deck' UI
    console.error('No deck ID provided')
    return
  }

  let cachedDeck = deckStore.getDeckById(props.id)

  if (cachedDeck) {
    //TODO: Store in deck variable and find a way to ensure that it exists for the template
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

  deckLoading.value = false
}

async function updateDeck(newDeck: Deck, newCards: Card[]): Promise<void> {
  try {
    await updateDeckById(props.id, newDeck)
    await saveCards(newCards)
    alert('saved successfully')
  } catch (e) {
    console.log(e)
    alert('failed to save changes')
  }
}

async function deleteDeck(): Promise<void> {
  await deleteCardsByDeckID(props.id)
  await deleteDeckById(props.id)
  router.push({ name: 'dashboard' })
}

async function getCards(): Promise<void> {
  if (props.id) {
    cards.value = await getCardsByDeckID(props.id)
  } else {
    // TODO: Reroute
  }

  cardsLoading.value = false
}

function onAddCard(): void {
  cards.value.push({
    order: cards.value.length,
    frontText: '',
    backText: ''
  })
}

async function saveCards(cards: CardMutation[]): Promise<void> {
  await updateCardsByDeckID(props.id, cards)
}
</script>
