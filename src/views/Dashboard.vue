<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchMemberDecks } from '@/services/deck-service'
import { useToastStore } from '@/stores/toast'
import Deck from '@/components/deck.vue'
import { useRouter } from 'vue-router'
import { createDeck } from '@/services/deck-service'

const toastStore = useToastStore()
const router = useRouter()

const create_deck_modal_open = ref(false)
const loading = ref(true)
const decks = ref<Deck[]>([])
const title = ref('')
const description = ref('')

onMounted(async () => {
  await refetchDecks()
  loading.value = false
})

const due_decks = computed(() => {
  return decks.value.filter((deck) => deck.due_cards?.length ?? 0 > 0)
})

async function refetchDecks() {
  try {
    decks.value = await fetchMemberDecks()
  } catch (e: any) {
    toastStore.error(e.message)
  }
}

function onDeckClicked(deck: Deck) {
  router.push({ name: 'deck', params: { id: deck.id } })
}

async function onCreateDeck() {
  await createDeck({
    title: title.value,
    description: description.value
  })
  await refetchDecks()

  create_deck_modal_open.value = false
  title.value = ''
  description.value = ''
}
</script>

<template>
  <div class="flex h-full flex-col gap-16">
    <div class="flex flex-col gap-4">
      <h1 class="text-grey-700 text-3xl">{{ $t('dashboard.due') }}</h1>
      <div class="flex gap-4">
        <Deck
          v-for="(deck, index) in due_decks"
          :key="index"
          :deck="deck"
          @clicked="() => onDeckClicked(deck)"
        />
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <h1 class="text-grey-700 text-3xl">All Decks</h1>
      <div class="flex gap-4">
        <Deck
          v-for="(deck, index) in decks"
          :key="index"
          :deck="deck"
          @clicked="() => onDeckClicked(deck)"
        />
      </div>
      <ui-kit:button icon-left="add" @click="create_deck_modal_open = true"
        >Create Deck</ui-kit:button
      >
    </div>
  </div>

  <ui-kit:modal :open="create_deck_modal_open" @closed="create_deck_modal_open = false">
    <div
      class="bg-brown-300 rounded-11 shadow-modal flex w-full flex-col items-center justify-center
        overflow-hidden pb-6 lg:max-w-max"
    >
      <div
        data-testid="edit-card-modal__title"
        class="wave-bottom flex w-full justify-center bg-purple-500 pt-12 pb-16 text-white"
      >
        <h1 class="font-primary text-5xl font-semibold">Create Deck</h1>
      </div>
      <div
        data-testid="edit-card-modal__body"
        class="flex w-full flex-col items-center gap-2 px-16"
      >
        <ui-kit:input type="text" placeholder="Title" v-model="title" />
        <ui-kit:input type="text" placeholder="Description" v-model="description" />
        <ui-kit:button icon-left="add" @click="onCreateDeck">Create</ui-kit:button>
      </div>
    </div>
  </ui-kit:modal>
</template>
