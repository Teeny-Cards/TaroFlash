<template>
  <Study v-if="studying" :cards="cards"></Study>
  <Edit
    v-else-if="editing"
    v-model:title="title"
    v-model:description="description"
    :cards="cards"
    @updateCardFront="onUpdateCardFront"
    @updateCardBack="onUpdateCardBack"
    @addCard="onAddCard"
    @saveDeck="saveDeck"
  ></Edit>
  <Deck
    v-else
    :id="id"
    :title="title"
    :description="description"
    :cards="cards"
    @study="onStudyClicked"
    @edit="onEditClicked"
    @deleteDeck="deleteDeck"
  />
</template>

<script setup lang="ts">
import Deck from '@/components/views/deck.vue'
import Study from '@/components/views/study.vue'
import Edit from '@/components/views/edit.vue'
import { useDeckStore } from '@/stores/decks'
import { computed, onMounted, ref } from 'vue'
import { getDeckById, deleteDeckById, updateDeckById } from '@/services/deckService'
import { getCardsByDeckID, deleteCardsByDeckID } from '@/services/cardService'
import { useRoute } from 'vue-router'
import router from '@/router'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const route = useRoute()
const deckStore = useDeckStore()
const title = ref('')
const description = ref('')
const isPublic = ref()
const cards = ref<Card[]>([])

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
    title.value = cachedDeck.title
    description.value = cachedDeck.description
    isPublic.value = cachedDeck.isPublic
  } else {
    const fetchedDeck = await getDeckById(props.id)

    if (fetchedDeck) {
      title.value = fetchedDeck.title
      description.value = fetchedDeck.description
      isPublic.value = fetchedDeck.isPublic
    } else {
      //TODO: Show error state
      console.log('Deck not found')
    }
  }
}

async function saveDeck(): Promise<void> {
  const newDeck: Deck = {
    id: props.id,
    title: title.value,
    description: description.value,
    isPublic: isPublic.value,
    count: cards.value.length
  }

  await updateDeckById(props.id, newDeck)
  // saveCards(props.id)
}

async function deleteDeck(): Promise<void> {
  await deleteCardsByDeckID(props.id)
  await deleteDeckById(props.id)
  router.push({ name: 'dashboard' })
}

async function getCards(): Promise<void> {
  if (props.id) {
    cards.value = await getCardsByDeckID(props.id)
  }
}

function onAddCard(): void {
  cards.value.push({
    order: cards.value.length,
    frontText: '',
    backText: ''
  })
}

function onUpdateCardFront(index: number, value: string): void {
  //
}

function onUpdateCardBack(index: number, value: string): void {
  //
}

async function saveCards(deckId: string): Promise<void> {
  // await saveCardsToDeck(deckId, cards.value)
  // TODO: Save Cards to Deck
}
</script>
