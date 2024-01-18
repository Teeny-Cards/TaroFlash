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
  try {
    await deckStore.fetchDeckById(props.id)
  } catch (e: any) {
    toastStore.addToast({
      message: e.message,
      state: 'error'
    })
  }

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
  const response = await updateDeckById(props.id, newDeck)

  if (response.success) {
    saveCards(newCards)
  } else {
    toastStore.addToast({
      message: response.error.message,
      state: 'error'
    })
  }
}

async function deleteDeck(): Promise<void> {
  const response = await deleteDeckById(props.id)

  if (response.success) {
    toastStore.addToast({
      message: 'Deck deleted successfully'
    })
    router.push({ name: 'dashboard' })
  } else {
    toastStore.addToast({
      message: response.error.message,
      state: 'error'
    })
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

async function saveCards(cards: CardMutation[]): Promise<void> {
  const response = await updateCardsByDeckID(props.id, cards)

  if (response.success) {
    toastStore.addToast({
      message: 'Saved Successfully'
    })
  } else {
    toastStore.addToast({
      message: response.error.message,
      state: 'error'
    })
  }
}
</script>
