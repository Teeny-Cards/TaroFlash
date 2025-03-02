<template>
  <div v-if="loading">Loading...</div>
  <section v-else tid="deck-view" class="flex flex-col items-center gap-6">
    <div tid="top-actions" class="w-full">
      <TeenyButton
        size="teeny"
        icon-left="chevron-left"
        icon-size="teeny"
        variant="muted"
        @click="routeBack"
        >Back</TeenyButton
      >
    </div>
    <div
      tid="body"
      class="flex flex-col items-center gap-6 sm:gap-16 w-full lg:flex-row lg:gap-26 lg:items-start"
    >
      <div
        tid="body-header"
        class="flex flex-col items-center gap-6 w-max sm:flex-row sm:items-end lg:flex-col lg:items-start"
      >
        <TeenyCard size="large" class="relative overflow-hidden">
          <div v-if="currentDeck.image?.url" class="absolute inset-0">
            <img
              :src="currentDeck.image?.url"
              alt="Deck Image preview"
              class="object-cover w-full h-full"
            /></div
        ></TeenyCard>
        <div tid="header-content" class="flex flex-col items-center gap-6 sm:items-start">
          <div tid="header-title" class="flex flex-col items-center gap-2 sm:items-start">
            <h1 class="w-64 m-0 text-4xl text-center font-primary text-grey-dark sm:text-left">
              {{ currentDeck.title }}
            </h1>
            <h2 class="w-64 text-sm text-center text-grey sm:text-left">
              {{ currentDeck.description }}
            </h2>
            <div tid="header-created-by" class="flex items-center gap-2 text-blue">
              <TeenyIcon src="user" />
              <h2 class="text-base font-semibold font-primary">{{ currentDeck.createdBy }}</h2>
            </div>
          </div>
          <div tid="header-actions" class="flex items-center gap-2.5">
            <TeenyButton icon-left="play" fancy-hover>Study</TeenyButton>
            <DeckSettingsModal />
          </div>
        </div>
      </div>
      <div tid="card-list-container" class="flex flex-col gap-8 w-full">
        <div tid="card-list__actions" class="flex justify-center gap-2.5 w-full">
          <TeenyButton
            icon-only
            icon-left="close"
            variant="muted"
            @click="cancelSelectionMode"
          ></TeenyButton>
          <TeenyButton icon-only icon-left="move-item"></TeenyButton>
          <TeenyButton icon-only icon-left="delete" variant="danger"></TeenyButton>
        </div>
        <div tid="card-list" class="flex gap-2 flex-col w-full">
          <template v-for="card in currentDeckCards" :key="card.id">
            <ListItem
              tid="card-list__item"
              :card="card"
              :selected="selectedCards.includes(card)"
              :selectionModeActive="selectionModeActive"
              @click="onEditCard(card)"
              @selectCard="(card: Card) => onSelectCard(card)"
              @deleteCard="(card: Card) => onDeleteCard(card)"
            />
            <div class="w-full border-dashed border-b border-b-grey"></div>
          </template>
        </div>
      </div>
    </div>
  </section>

  <TeenyModal @close="editCardModalVisible = false" :open="editCardModalVisible">
    <EditCardModal
      v-if="currentDeckCards.length > 0"
      @cancel="editCardModalVisible = false"
      @save="saveCards"
      :cards="currentDeckCards"
      :index="editingCard?.order ?? 0"
    />
  </TeenyModal>
</template>

<script setup lang="ts">
import TeenyCard from '@teeny/TeenyCard.vue'
import TeenyIcon from '@teeny/TeenyIcon.vue'
import TeenyButton from '@teeny/TeenyButton.vue'
import TeenyModal from '@teeny/TeenyModal.vue'
import ListItem from './components/ListItem.vue'
import EditCardModal from './components/EditCardModal.vue'
import DeckSettingsModal from '@/components/DeckSettingsModal.vue'
import { useDeckStore } from '@/stores/decks'
import { useMessageStore } from '@/stores/message'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { deleteCardById } from '@/services/cardService'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const deckStore = useDeckStore()
const messageStore = useMessageStore()
const router = useRouter()

const { currentDeck, currentDeckCards } = storeToRefs(deckStore)
const loading = ref(true)
const editCardModalVisible = ref(false)
const editingCard = ref<Card | undefined>()
const selectionModeActive = ref(false)
const selectedCards = ref<Card[]>([])

onMounted(async () => {
  await getDeck()
  loading.value = false
})

function routeBack(): void {
  router.go(-1)
}

function onDeleteCard(card: Card): void {
  editingCard.value = card

  messageStore.alert({
    title: 'Delete Card',
    message: `Are you sure you want to delete ${card.frontText}?`,
    actions: [
      {
        label: 'Cancel',
        variant: 'muted',
        iconLeft: 'close',
        action: () => messageStore.removeAlert()
      },
      {
        label: 'Delete',
        variant: 'danger',
        iconLeft: 'delete',
        action: () => {
          messageStore.removeAlert()
          deleteCard(card)
        }
      }
    ]
  })
}

async function getDeck(): Promise<void> {
  try {
    await deckStore.fetchDeckById(props.id)
    await deckStore.fetchCardsByDeckId(props.id)
  } catch (e: any) {
    messageStore.error(e.message)
    // router.push({ name: 'dashboard' })
  }
}

function cancelSelectionMode(): void {
  selectionModeActive.value = false
  selectedCards.value = []
}

function onSelectCard(card: Card): void {
  selectionModeActive.value = true

  if (selectedCards.value.includes(card)) {
    selectedCards.value = selectedCards.value.filter((c) => c.id !== card.id)
  } else {
    selectedCards.value.push(card)
  }
}

function onEditCard(card: Card): void {
  if (selectionModeActive.value) {
    return onSelectCard(card)
  }

  editingCard.value = card
  editCardModalVisible.value = true
}

async function saveCards(cards: CardMutation[]): Promise<void> {
  try {
    await deckStore.updateCardsByDeckId(props.id, cards)
    editCardModalVisible.value = false
    messageStore.success('Saved Successfully')
  } catch (e: any) {
    messageStore.error(e.message)
  }
}

async function deleteCard(card: Card) {
  try {
    await deleteCardById(card.id)
    messageStore.success('Deleted Successfully')
  } catch (e: any) {
    messageStore.error(e.message)
  }
}
</script>
