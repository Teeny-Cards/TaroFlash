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
        class="sticky top-0 flex flex-col items-center gap-6 w-max sm:flex-row sm:items-end lg:flex-col lg:items-start"
      >
        <TeenyCard size="large" class="relative overflow-hidden">
          <div v-if="currentDeck?.image?.url" class="absolute inset-0">
            <img
              :src="currentDeck.image?.url"
              alt="Deck Image preview"
              class="object-cover w-full h-full"
            /></div
        ></TeenyCard>
        <div tid="header-content" class="flex flex-col items-center gap-6 sm:items-start">
          <div tid="header-title" class="flex flex-col items-center gap-2 sm:items-start">
            <h1 class="w-64 m-0 text-4xl text-center font-primary text-grey-dark sm:text-left">
              {{ currentDeck?.title }}
            </h1>
            <h2 class="w-64 text-sm text-center text-grey sm:text-left">
              {{ currentDeck?.description }}
            </h2>
            <div tid="header-created-by" class="flex items-center gap-2 text-blue">
              <TeenyIcon src="user" />
              <h2 class="text-base font-semibold font-primary">
                {{ currentDeck?.member?.display_name }}
              </h2>
            </div>
          </div>
          <div tid="header-actions" class="flex items-center gap-2.5">
            <TeenyButton icon-left="play" fancy-hover>Study</TeenyButton>
            <DeckSettingsModal :deck="currentDeck" />
          </div>
        </div>
      </div>
      <div
        v-if="currentDeck?.cards?.length === 0"
        tid="empty-state"
        class="flex flex-col gap-4 justify-center items-center w-full self-center"
      >
        <h1 class="text-2xl font-semibold text-grey-dark">No Cards</h1>
        <TeenyButton icon-left="add" fancy-hover @click="addCard">Add Card</TeenyButton>
      </div>
      <div v-else tid="card-list-container" class="flex flex-col items-center gap-8 w-full">
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
          <template v-for="card in currentDeck?.cards" :key="card.id">
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
        <TeenyButton icon-left="add" fancy-hover @click="addCard">Add Card</TeenyButton>
      </div>
    </div>
  </section>

  <TeenyModal @close="editCardModalVisible = false" :open="editCardModalVisible">
    <EditCardModal
      v-if="currentDeck?.cards?.length ?? 0 > 0"
      @cancel="editCardModalVisible = false"
      @save="onSaveCards"
      :cards="currentDeck?.cards ?? []"
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
import { useMessageStore } from '@/stores/message'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { deleteCardById } from '@/services/cardService'
import { saveCards } from '@/services/cardService'
import { getDeckById } from '@/services/deckService'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const messageStore = useMessageStore()
const router = useRouter()

const currentDeck = ref<Deck>()
const loading = ref(true)
const editCardModalVisible = ref(false)
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
  messageStore.alert({
    title: 'Delete Card',
    message: `Are you sure you want to delete ${card.front_text}?`,
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

async function addCard(): Promise<void> {
  if (!currentDeck.value) {
    return
  }

  const newCard: Card = {
    front_text: '',
    back_text: '',
    deck_id: currentDeck.value.id
  }

  const cards = await saveCards([newCard])
  currentDeck?.value?.cards?.push(...cards)

  editCardModalVisible.value = true
}

async function getDeck(): Promise<void> {
  try {
    currentDeck.value = await getDeckById(props.id)
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

  editCardModalVisible.value = true
}

async function onSaveCards(cards: Card[]): Promise<void> {
  try {
    const new_cards = await saveCards(cards)

    for (const card of new_cards) {
      const index = currentDeck.value?.cards?.findIndex((c) => c.id === card.id)

      if (index && index !== -1) {
        currentDeck.value?.cards?.splice(index, 1, card)
      }
    }

    editCardModalVisible.value = false
    messageStore.success('Saved Successfully')
  } catch (e: any) {
    messageStore.error(e.message)
  }
}

async function deleteCard(card: Card) {
  if (!card.id) {
    return
  }

  try {
    await deleteCardById(card.id)
    currentDeck.value = await getDeckById(props.id)

    messageStore.success('Deleted Successfully')
  } catch (e: any) {
    messageStore.error(e.message)
  }
}
</script>
