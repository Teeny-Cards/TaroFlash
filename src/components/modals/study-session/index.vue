<script setup lang="ts">
import Session from './session.vue'

export type StudySessionResponse = {
  score: number
  total: number
  remaining_due: number
  study_all_used: boolean
}

const { deck, close, config_override } = defineProps<{
  deck: Deck
  close: (response?: StudySessionResponse) => void
  config_override?: Partial<DeckConfig>
}>()

function onSessionFinished(
  score: number,
  total: number,
  remaining_due: number,
  study_all_used: boolean
) {
  close({ score, total, remaining_due, study_all_used })
}
</script>

<template>
  <div
    data-testid="study-session"
    class="rounded-b-0 sm:rounded-b-8 rounded-t-8 shadow-lg overflow-hidden pb-4 relative bg-brown-300 dark:bg-grey-800 w-full h-full sm:h-auto sm:w-160"
  >
    <session
      :deck="deck"
      :config_override="config_override"
      @closed="close"
      @finished="onSessionFinished"
    />
  </div>
</template>
