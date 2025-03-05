<template>
  <div class="grid grid-cols-deck-view-lg p-8 gap-8">
    <section class="flex flex-col gap-8 fixed">
      <TeenyCard
        class="relative overflow-hidden hover:ring-4 hover:ring-green-400 transition cursor-pointer group"
      >
        <div v-if="deckImagePreview" class="absolute inset-0">
          <img
            :src="deckImagePreview"
            alt="Deck Image preview"
            class="object-cover w-full h-full"
          />
        </div>

        <imageUploader @imageUploaded="onDeckImageUploaded">
          <div
            v-if="!deckImagePreview"
            class="w-full h-full flex flex-col gap-2 items-center justify-center text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 -960 960 960">
              <path
                d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h360v80H200v560h560v-360h80v360q0 33-23.5 56.5T760-120H200Zm480-480v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM240-280h480L570-480 450-320l-90-120-120 160Zm-40-480v560-560Z"
                fill="currentColor"
              />
            </svg>
            <p class="text-2xl font-semibold">Choose Cover</p>
          </div>
        </imageUploader>

        <div
          v-if="deckImagePreview"
          class="absolute inset-0 p-3 flex flex-col items-start opacity-0 group-hover:opacity-100 transition-opacity bg-[#4a4a4a80] pointer-events-none"
        >
          <TeenyButton variant="ghost" class="pointer-events-auto" @onClick="removeDeckImage">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
              <path
                d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                fill="currentColor"
              />
            </svg>
          </TeenyButton>
          <div class="h-full w-full flex justify-center items-center">
            <p class="text-white">Upload New Photo</p>
          </div>
        </div>
      </TeenyCard>
      <TeenyInput type="text" placeholder="Enter Title" v-model="title" />
      <TeenyInput type="text" placeholder="Enter Description" v-model="description" />
      <div class="w-full flex gap-2">
        <TeenyButton color="gray" variant="secondary" @onClick="cancel" class="w-full"
          >Cancel</TeenyButton
        >
        <TeenyButton @click="saveDeck" class="w-full">Save</TeenyButton>
      </div>
    </section>
    <section
      class="bg-white rounded-12 w-full flex flex-col-reverse gap-8 items-center shadow-md p-20 relative col-start-2"
    >
      <TeenyCardEditor
        v-for="(card, index) in nonDeletedCards"
        :key="card.id"
        :card="card"
        :index="index"
        @frontInput="updateFront"
        @backInput="updateBack"
        @delete="deleteCard"
      />

      <button
        @click="addCard"
        class="bg-green-400 p-5 rounded-full text-white absolute shadow-md -right-8 top-52"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" fill="currentColor" />
        </svg>
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import TeenyCard from '@teeny/TeenyCard.vue'
import TeenyButton from '@teeny/TeenyButton.vue'
import TeenyInput from '@teeny/TeenyInput.vue'
import TeenyCardEditor from '@teeny/TeenyCardEditor.vue'
import { ref, type PropType, computed } from 'vue'
import imageUploader from '@/components/TheImageUploader.vue'
import generateUID from '@/utils/uid'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  deck: {
    type: Object as PropType<Deck>
  },
  cards: {
    type: Object as PropType<Card[]>,
    required: true
  }
})

const emit = defineEmits<{
  (event: 'saveDeck', newDeck: Deck, newCards: Card[]): void
  (event: 'cancel'): void
}>()

const userStore = useUserStore()
const { username } = userStore
const deckImagePreview = ref(props.deck?.image?.url)
const deckImageFile = ref()
const deckImageDeleted = ref(false)
const title = ref(props.deck?.title ?? '')
const description = ref(props.deck?.description ?? '')
const isPublic = ref(false)
const cards = ref<CardMutation[]>(props.cards)

const nonDeletedCards = computed(() => {
  return cards.value.filter((card) => !card.deleted)
})

function onDeckImageUploaded(preview: string, file: File): void {
  deckImagePreview.value = preview
  deckImageFile.value = file
}

function addCard(): void {
  cards.value.push({
    order: cards.value.length,
    frontText: '',
    backText: '',
    dirty: true,
    id: generateUID()
  })
}

function deleteCard(index: number): void {
  const card = cards.value[index]

  if (card) {
    const updatedCard = { ...card, deleted: true, dirty: true }
    cards.value.splice(index, 1, updatedCard)
  }
}

function updateFront(index: number, value: string): void {
  const card = cards.value[index]

  if (card) {
    const updatedCard = { ...card, frontText: value, dirty: true }
    cards.value.splice(index, 1, updatedCard)
  }
}

function updateBack(index: number, value: string): void {
  const card = cards.value[index]

  if (card) {
    const updatedCard = { ...card, backText: value, dirty: true }
    cards.value.splice(index, 1, updatedCard)
  }
}

function removeDeckImage(): void {
  deckImagePreview.value = undefined
  deckImageFile.value = undefined
  deckImageDeleted.value = true
}

function saveDeck(): void {
  const newDeck: Deck = {
    id: '',
    ...props.deck,
    is_public: isPublic.value,
    title: title.value,
    description: description.value,
    count: cards.value.length,
    image: {
      ...props.deck?.image,
      newFile: deckImageFile.value,
      deleted: deckImageDeleted.value
    }
  }

  const newCards = cards.value.filter((card: CardMutation) => card.dirty)

  emit('saveDeck', newDeck, newCards)
}

function cancel(): void {
  emit('cancel')
}
</script>
