<script setup lang="ts">
import Card from '@/components/card.vue'
import { computed } from 'vue'
import deckPreview from './popovers/deck-preview.vue'
import StudyModal from './modals/study-modal/index.vue'
import { useModal } from '@/composables/use-modal'
import { useDeckConfiguration } from '@/composables/use-deck-configuration'

const modal = useModal()

const { deck } = defineProps<{ deck: Deck }>()
defineEmits<{ (e: 'clicked'): void }>()

const { image_url } = useDeckConfiguration(deck)

function onStudyClicked() {
  modal.open(StudyModal, {
    props: {
      deck
    }
  })
}

const numCardsDue = computed(() => {
  return deck.due_cards?.length ?? 0
})
</script>

<template>
  <div data-testid="deck" class="relative flex w-max flex-col gap-2.5">
    <Card
      size="small"
      class="border-brown-300 relative cursor-pointer overflow-hidden border-8"
      @click="$emit('clicked')"
      :image_url="image_url"
    >
      <template #back>
        <deck-preview :deck="deck" :image-url="image_url" @study="onStudyClicked" />
      </template>
    </Card>

    <div
      v-if="numCardsDue"
      class="ring-brown-100 absolute -top-2 -right-2 flex h-7.5 w-7.5 items-center justify-center rounded-full
        bg-red-500 ring-4"
    >
      <h2 class="text-base text-white">{{ numCardsDue }}</h2>
    </div>

    <div>
      <h2 class="text-md text-brown-700">{{ deck.title }}</h2>
    </div>
  </div>
</template>
