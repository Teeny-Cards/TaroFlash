<script setup lang="ts">
import Card from '@/components/card.vue'
import { computed } from 'vue'
import deckPreview from './popovers/deck-preview.vue'
import StudyModal from './modals/study-session/index.vue'
import { useModal } from '@/composables/use-modal'
import { useDeckEditor } from '@/composables/use-deck-editor'

const modal = useModal()

const { deck } = defineProps<{ deck: Deck }>()
defineEmits<{ (e: 'clicked'): void; (e: 'updated'): void }>()

const { image_url } = useDeckEditor(deck)

function onStudyClicked() {
  modal.open(StudyModal, {
    backdrop: true,
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
      class="relative cursor-pointer"
      @click="$emit('clicked')"
      :image_url="image_url"
    >
      <template #back>
        <div
          v-if="numCardsDue"
          class="ring-brown-100 absolute -top-4 -right-4 flex h-7.5 w-7.5 items-center justify-center rounded-full
            bg-red-500 ring-4"
        >
          <h2 class="text-base text-white">{{ numCardsDue }}</h2>
        </div>

        <deck-preview
          :deck="deck"
          :image-url="image_url"
          @study="onStudyClicked"
          @updated="$emit('updated')"
        />
      </template>
    </Card>

    <div>
      <h2 class="text-md text-brown-700">{{ deck.title }}</h2>
    </div>
  </div>
</template>
