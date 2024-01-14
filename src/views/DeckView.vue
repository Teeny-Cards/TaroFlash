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
      @delete="deleteDeck"
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
import { getCardsByDeckID, updateCardsByDeckID } from '@/services/cardService'
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
    deck.value = cachedDeck
  } else {
    const response = await getDeckById(props.id)

    if (response.success) {
      deck.value = response.value
    } else {
      alert(response.error.message)
    }
  }

  deckLoading.value = false
}

async function updateDeck(newDeck: Deck, newCards: Card[]): Promise<void> {
  const response = await updateDeckById(props.id, newDeck)

  if (response.success) {
    saveCards(newCards)
  } else {
    alert(response.error.message)
    //TODO: Show error
  }
}

async function deleteDeck(): Promise<void> {
  const response = await deleteDeckById(props.id)

  if (response.success) {
    router.push({ name: 'dashboard' })
  } else {
    alert(response.error.message)
    //TODO: Show failed error
  }
}

async function getCards(): Promise<void> {
  const response = await getCardsByDeckID(props.id)

  if (response.success) {
    cards.value = response.value
    cardsLoading.value = false
  } else {
    alert(response.error.message)
    // TODO: error toast + reroute
  }
}

function onAddCard(): void {
  cards.value.push({
    order: cards.value.length,
    frontText: '',
    backText: ''
  })
}

async function saveCards(cards: CardMutation[]): Promise<void> {
  const response = await updateCardsByDeckID(props.id, cards)

  if (response.success) {
    alert('Saved Successfully')
    // TODO: success toast + reroute?
  } else {
    alert(response.error.message)
    // TODO: fail toast
  }
}
</script>
