<template>
  <div class="flex flex-col gap-8">
    <TeenyCard class="relative overflow-hidden">
      <div v-if="deckImagePreview" class="absolute inset-0">
        <img :src="deckImagePreview" alt="Deck Image preview" class="object-cover w-full h-full" />
      </div>

      <ImageUploader v-if="editing" @imageUploaded="onDeckImageUploaded">
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

        <div
          v-else
          class="w-full h-full p-3 flex flex-col items-start opacity-0 group-hover:opacity-100 transition-opacity bg-[#4a4a4a80] pointer-events-none"
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
      </ImageUploader>
    </TeenyCard>

    <TeenyInput v-if="editing" type="text" placeholder="Enter Title" v-model="title" />
    <h1 v-else class="text-xl font-semibold text-gray-400">{{ deck.title }}</h1>

    <TeenyInput v-if="editing" type="text" placeholder="Enter Description" v-model="description" />
    <h2 v-else class="text-gray-400">{{ deck.description }}</h2>

    <div class="w-full flex gap-2">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import TeenyCard from '@/components/TeenyComponents/TeenyCard.vue'
import TeenyInput from '@/components/TeenyComponents/TeenyInput.vue'
import ImageUploader from '@/components/ImageUploader.vue'
import { ref, type PropType } from 'vue'

const props = defineProps({
  deck: {
    type: Object as PropType<Deck>,
    required: true
  },
  editing: Boolean
})

const deckImagePreview = ref(props.deck?.image?.url)
const deckImageFile = ref()
const deckImageDeleted = ref(false)
const title = ref(props.deck?.title ?? '')
const description = ref(props.deck?.description ?? '')

function onDeckImageUploaded(preview: string, file: File): void {
  deckImagePreview.value = preview
  deckImageFile.value = file
}

function removeDeckImage(): void {
  deckImagePreview.value = undefined
  deckImageFile.value = undefined
  deckImageDeleted.value = true
}
</script>
