<script setup lang="ts">
import ListItem from '@/components/deck-view/list-item.vue'
import EditCardModal from '@/components/deck-view/edit-card-modal.vue'
import StudyModal from '@/components/study-modal/index.vue'
import { useToastStore } from '@/stores/toast'
import { useSessionStore } from '@/stores/session'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createCard, saveCards, deleteCardById } from '@/services/cardService'
import { fetchDeckById } from '@/services/deckService'

const { id: deck_id } = defineProps<{
  id: string
}>()

const toastStore = useToastStore()
const sessionStore = useSessionStore()
const router = useRouter()

const currentDeck = ref<Deck>()
const editCardModalVisible = ref(false)
const editCardModalFocusedCardId = ref<number>()
const selectionModeActive = ref(false)
const selectedCards = ref<Card[]>([])
const studyModalOpen = ref(false)

onMounted(async () => {
  sessionStore.startLoading()
  await getDeck()
  sessionStore.stopLoading()
})

function routeBack(): void {
  router.go(-1)
}

function onDeleteCard(card: Card): void {
  deleteCard(card)
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

  try {
    const card = await createCard(newCard)
    currentDeck?.value?.cards?.push(card)
  } catch {
    toastStore.error('Failed to create card')
  }
}

async function getDeck(): Promise<void> {
  try {
    const id = Number(deck_id)
    currentDeck.value = await fetchDeckById(id)
  } catch (e: any) {
    toastStore.error(e.message)
    router.push({ name: 'dashboard' })
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

  editCardModalFocusedCardId.value = card.id
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
    toastStore.success('Saved Successfully')
  } catch (e: any) {
    toastStore.error(e.message)
  }
}

async function deleteCard(card: Card) {
  if (!card.id) {
    return
  }

  try {
    await deleteCardById(card.id)

    const id = Number(deck_id)
    currentDeck.value = await fetchDeckById(id)

    toastStore.success('Deleted Successfully')
  } catch (e: any) {
    toastStore.error(e.message)
  }
}
</script>

<template>
  <section tid="deck-view" class="flex flex-col items-center gap-6">
    <div tid="top-actions" class="w-full">
      <ui-kit:button
        size="xs"
        icon-left="chevron-left"
        icon-size="xs"
        variant="muted"
        @click="routeBack"
        >{{ $t('common.back') }}</ui-kit:button
      >
    </div>

    <div
      tid="body"
      class="flex w-full flex-col items-center gap-6 sm:gap-16 lg:flex-row lg:items-start lg:gap-26"
    >
      <div
        v-if="currentDeck?.cards?.length === 0"
        tid="empty-state"
        class="flex w-full flex-col items-center justify-center gap-4 self-center"
      >
        <h1 class="text-grey-dark text-3xl font-semibold">{{ $t('deck-view.no-cards') }}</h1>
        <ui-kit:button icon-left="add" fancy-hover @click="addCard">
          {{ $t('deck-view.add-card') }}
        </ui-kit:button>
      </div>
      <div v-else tid="card-list-container" class="flex w-full flex-col items-center gap-8">
        <div tid="card-list__actions" class="flex w-full justify-center gap-2.5">
          <ui-kit:button
            icon-only
            icon-left="close"
            variant="muted"
            @click="cancelSelectionMode"
          ></ui-kit:button>
          <ui-kit:button icon-only icon-left="move-item"></ui-kit:button>
          <ui-kit:button icon-only icon-left="delete" variant="danger"></ui-kit:button>
        </div>
        <div tid="card-list" class="flex w-full flex-col gap-2">
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
            <div class="border-b-grey w-full border-b border-dashed"></div>
          </template>
        </div>
        <ui-kit:button icon-left="add" fancy-hover @click="addCard">{{
          $t('deck-view.add-card')
        }}</ui-kit:button>
      </div>
    </div>
  </section>

  <ui-kit:modal @closed="editCardModalVisible = false" :open="editCardModalVisible">
    <EditCardModal
      v-if="(currentDeck?.cards?.length ?? 0 > 0) && editCardModalFocusedCardId"
      @cancel="editCardModalVisible = false"
      @save="onSaveCards"
      :cards="currentDeck?.cards ?? []"
      :focused-card-id="editCardModalFocusedCardId"
    />
  </ui-kit:modal>

  <StudyModal
    :open="studyModalOpen && Boolean(currentDeck?.cards?.length ?? 0 > 0)"
    :deck="currentDeck!"
    @closed="studyModalOpen = false"
  />
</template>
