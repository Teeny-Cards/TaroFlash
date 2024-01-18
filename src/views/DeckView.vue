<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <Study v-if="studying" :cards="cards"></Study>
    <Edit
      v-else-if="editing && currentDeck"
      :deck="currentDeck"
      :cards="cards"
      @saveDeck="updateDeck"
      @cancel="onCancelEdit"
    ></Edit>
    <Deck
      v-else-if="currentDeck"
      :deck="currentDeck"
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
import { useToastStore } from '@/stores/toast'
import { computed, onMounted, ref } from 'vue'
import { deleteDeckById, updateDeckById } from '@/services/deckService'
import { getCardsByDeckID, updateCardsByDeckID } from '@/services/cardService'
import { useRoute } from 'vue-router'
import router from '@/router'
import { storeToRefs } from 'pinia'

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
const toastStore = useToastStore()
const cards = ref<Card[]>([])

const { currentDeck } = storeToRefs(deckStore)

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
  await getDeck()
  await getCards()

  deckLoading.value = false
})

function onStudyClicked(): void {
  if (cards.value.length > 0) {
    router.push({ name: 'deck', params: { id: props.id }, query: { mode: 'study' } })
  }
}

function onEditClicked(): void {
  router.push({ name: 'deck', params: { id: props.id }, query: { mode: 'edit' } })
}

function onCancelEdit(): void {
  router.push({ name: 'deck', params: { id: props.id } })
}

async function updateDeck(newDeck: Deck, newCards: Card[]): Promise<void> {
  try {
    await updateDeckById(props.id, newDeck)
    saveCards(newCards)
  } catch (e: any) {
    toastStore.addToast({
      message: e.message,
      state: 'error'
    })
  }
}

async function deleteDeck(): Promise<void> {
  try {
    await deleteDeckById(props.id)

    toastStore.addToast({
      message: 'Deck deleted successfully'
    })

    router.push({ name: 'dashboard' })
  } catch (e: any) {
    toastStore.addToast({
      message: e.message,
      state: 'error'
    })
  }
}

async function getDeck(): Promise<void> {
  try {
    await deckStore.fetchDeckById(props.id)
  } catch (e: any) {
    toastStore.addToast({
      message: e.message,
      state: 'error'
    })
  }
}

async function getCards(): Promise<void> {
  try {
    const newCards = await getCardsByDeckID(props.id)
    cards.value = newCards
    cardsLoading.value = false
  } catch (e: any) {
    toastStore.addToast({
      message: e.message,
      state: 'error'
    })
  }
}

async function saveCards(cards: CardMutation[]): Promise<void> {
  try {
    await updateCardsByDeckID(props.id, cards)

    toastStore.addToast({
      message: 'Saved Successfully'
    })
  } catch (e: any) {
    toastStore.addToast({
      message: e.message,
      state: 'error'
    })
  }
}
</script>
