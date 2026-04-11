<script setup lang="ts">
import SessionFlashcard from './session-flashcard.vue'
import UiButton from '@/components/ui-kit/button.vue'
import { useTemplateRef } from 'vue'

const { deck, config_override } = defineProps<{
  deck: Deck
  config_override?: Partial<DeckConfig>
}>()

const emit = defineEmits<{
  (e: 'closed'): void
  (
    e: 'finished',
    score: number,
    total: number,
    remaining_due: number,
    study_all_used: boolean
  ): void
}>()

// When additional study modes are added, swap this for a computed that
// maps deck.config?.study_mode to the appropriate mode component.
const mode_ref = useTemplateRef<InstanceType<typeof SessionFlashcard>>('mode')

function onCloseButtonClicked() {
  if (mode_ref.value?.requestClose) {
    // The mode component will decide how to handle the close request.
    mode_ref.value.requestClose()
    return
  }

  emit('closed')
}

function onFinished(score: number, total: number, remaining_due: number, study_all_used: boolean) {
  emit('finished', score, total, remaining_due, study_all_used)
}
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] grid-cols-1 items-center justify-between w-full h-full">
    <div
      data-testid="study-session__header"
      class="relative flex w-full justify-center bg-purple-500 wave-bottom-[50px] bgx-diagonal-stripes bgx-size-20 px-13 py-11.5 pb-14 z-10"
    >
      <div data-testid="study-session__actions" class="absolute top-0 left-0 p-4">
        <ui-button
          icon-left="close"
          theme="purple-500"
          inverted
          icon-only
          @click="onCloseButtonClicked"
        ></ui-button>
      </div>
      <h1 class="text-5xl text-white">{{ deck?.title }}</h1>
    </div>

    <session-flashcard
      ref="mode"
      :deck="deck"
      :config_override="config_override"
      @closed="emit('closed')"
      @finished="onFinished"
    />
  </div>
</template>
