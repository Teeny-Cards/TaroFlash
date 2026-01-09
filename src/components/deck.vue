<script setup lang="ts">
import Card from '@/components/card/index.vue'
import deckPreview from './popovers/deck-preview.vue'
import StudyModal from './modals/study-session/index.vue'
import { useModal } from '@/composables/modal'
import { useDeckEditor } from '@/composables/deck-editor'

const modal = useModal()

const { deck } = defineProps<{ deck: Deck }>()
defineEmits<{ (e: 'clicked'): void; (e: 'updated'): void }>()

function onStudyClicked() {
  modal.open(StudyModal, {
    backdrop: true,
    props: {
      deck
    },
    openAudio: 'ui.double_pop_up',
    closeAudio: 'ui.double_pop_down'
  })
}
</script>

<template>
  <div data-testid="deck" class="relative flex w-max flex-col gap-2.5">
    <deck-preview :deck="deck" @study="onStudyClicked" @updated="$emit('updated')">
      <card
        #trigger
        size="sm"
        class="relative cursor-pointer"
        @click="$emit('clicked')"
        :sfx="{ hover: 'ui.click_04' }"
      >
        <div
          v-if="deck.due_count"
          class="ring-brown-100 absolute -top-2 -right-2 flex h-7.5 w-7.5 items-center
            justify-center rounded-full bg-red-500 ring-6"
        >
          <h2 class="text-base text-white">{{ deck.due_count }}</h2>
        </div>
      </card>
    </deck-preview>

    <div>
      <h2 class="text-md text-brown-700 dark:text-brown-300">{{ deck.title }}</h2>
    </div>
  </div>
</template>
