<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <section deck-view class="px-4 py-7 flex flex-col items-center gap-6">
      <div deck-view__header class="flex flex-col items-center gap-6 w-max">
        <TeenyCard class="relative overflow-hidden">
          <div v-if="currentDeck.image?.url" class="absolute inset-0">
            <img
              :src="currentDeck.image?.url"
              alt="Deck Image preview"
              class="object-cover w-full h-full"
            /></div
        ></TeenyCard>
        <div deck-view__header__title class="flex flex-col items-center gap-2">
          <h1 class="font-primary text-4xl m-0 w-64 text-center text-grey-dark">
            {{ currentDeck.title }}
          </h1>
          <h2 class="text-sm text-grey text-center w-64">{{ currentDeck.description }}</h2>
          <div deck-view__header__created-by class="flex gap-2 items-center text-blue">
            <TeenyIcon src="user" />
            <h2 class="text-base font-semibold font-primary">{{ currentDeck.createdBy }}</h2>
          </div>
        </div>
        <div deck-view__header__actions class="flex items-center gap-2.5">
          <TeenyButton icon-left="play">Study</TeenyButton>
          <TeenyButton icon-left="settings" variant="muted" icon-only></TeenyButton>
        </div>
      </div>
      <CardList :cards="cards"></CardList>
    </section>
  </div>
</template>

<script setup lang="ts">
import TeenyCard from '@/components/TeenyCard.vue'
import TeenyIcon from '@/components/TeenyIcon.vue'
import CardList from '@/components/DeckViewCardList.vue'
import { useDeckStore } from '@/stores/decks'
import { useToastStore } from '@/stores/toast'
import { computed, onMounted, ref } from 'vue'
import { deleteDeckById, updateDeckById } from '@/services/deckService'
import { getCardsByDeckID, updateCardsByDeckID } from '@/services/cardService'
import router from '@/router'
import { storeToRefs } from 'pinia'
import TeenyButton from '@/components/TeenyButton.vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const deckStore = useDeckStore()
const toastStore = useToastStore()

const deckLoading = ref(true)
const cardsLoading = ref(true)
const cards = ref<Card[]>([])

const { currentDeck } = storeToRefs(deckStore)

const loading = computed(() => {
  return deckLoading.value || cardsLoading.value
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

async function updateDeck(newDeck: Deck, newCards: Card[]): Promise<void> {
  try {
    await updateDeckById(props.id, newDeck)
    saveCards(newCards)
  } catch (e: any) {
    toastStore.error(e.message)
  }
}

async function deleteDeck(): Promise<void> {
  try {
    await deleteDeckById(props.id)

    toastStore.success('Deck deleted successfully')
    router.push({ name: 'dashboard' })
  } catch (e: any) {
    toastStore.error(e.message)
  }
}

async function getDeck(): Promise<void> {
  try {
    await deckStore.fetchDeckById(props.id)
  } catch (e: any) {
    toastStore.error(e.message)
    router.push({ name: 'dashboard' })
  }
}

async function getCards(): Promise<void> {
  try {
    const newCards = await getCardsByDeckID(props.id)
    cards.value = newCards
    cardsLoading.value = false
  } catch (e: any) {
    toastStore.error(e.message)
  }
}

async function saveCards(cards: CardMutation[]): Promise<void> {
  try {
    await updateCardsByDeckID(props.id, cards)
    toastStore.success('Saved Successfully')
  } catch (e: any) {
    toastStore.error(e.message)
  }
}
</script>
@/components/views/deckView/CardList.vue
