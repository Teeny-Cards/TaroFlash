<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <section deck-view class="flex flex-col items-center gap-6 px-4 py-7">
      <div deck-view__top-actions class="hidden w-full">
        <TeenyButton size="teeny" icon-left="chevron-left" variant="muted" @click="routeBack"
          >Back</TeenyButton
        >
      </div>
      <div deck-view__header class="flex flex-col items-center gap-6 w-max">
        <TeenyCard size="large" class="relative overflow-hidden">
          <div v-if="currentDeck.image?.url" class="absolute inset-0">
            <img
              :src="currentDeck.image?.url"
              alt="Deck Image preview"
              class="object-cover w-full h-full"
            /></div
        ></TeenyCard>
        <div deck-view__header__title class="flex flex-col items-center gap-2">
          <h1 class="w-64 m-0 text-4xl text-center font-primary text-grey-dark">
            {{ currentDeck.title }}
          </h1>
          <h2 class="w-64 text-sm text-center text-grey">{{ currentDeck.description }}</h2>
          <div deck-view__header__created-by class="flex items-center gap-2 text-blue">
            <TeenyIcon src="user" />
            <h2 class="text-base font-semibold font-primary">{{ currentDeck.createdBy }}</h2>
          </div>
        </div>
        <div deck-view__header__actions class="flex items-center gap-2.5">
          <TeenyButton icon-left="play">Study</TeenyButton>
          <TeenyButton icon-left="settings" variant="muted" icon-only></TeenyButton>
        </div>
      </div>
      <CardList :cards="currentDeckCards" @editCard="onEditCard"></CardList>
    </section>
  </div>

  <TeenyModal @close="editCardModalVisible = false" :open="editCardModalVisible">
    <EditCardModal
      v-if="currentDeckCards.length > 0"
      @close="editCardModalVisible = false"
      :cards="currentDeckCards"
      :index="editCardIndex"
    />
  </TeenyModal>
</template>

<script setup lang="ts">
import TeenyCard from '@/components/TeenyCard.vue'
import TeenyIcon from '@/components/TeenyIcon.vue'
import TeenyButton from '@/components/TeenyButton.vue'
import TeenyModal from '@/components/TeenyModal.vue'
import CardList from '@/components/DeckViewCardList.vue'
import EditCardModal from '@/components/DeckViewEditCardModal.vue'
import { useDeckStore } from '@/stores/decks'
import { useToastStore } from '@/stores/toast'
import { onMounted, ref } from 'vue'
import { updateCardsByDeckID } from '@/services/cardService'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const deckStore = useDeckStore()
const toastStore = useToastStore()
const router = useRouter()

const { currentDeck, currentDeckCards } = storeToRefs(deckStore)
const loading = ref(true)
const editCardModalVisible = ref(true)
const editCardIndex = ref(0)

onMounted(async () => {
  await getDeck()
  loading.value = false
})

function routeBack(): void {
  router.go(-1)
}

async function getDeck(): Promise<void> {
  try {
    await deckStore.fetchDeckById(props.id)
  } catch (e: any) {
    toastStore.error(e.message)
    // router.push({ name: 'dashboard' })
  }
}

function onEditCard(index: number): void {
  editCardIndex.value = index
  editCardModalVisible.value = true
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
