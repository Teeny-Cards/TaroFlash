<script setup lang="ts">
import Session from './session.vue'

export type StudySessionResponse = { score: number; total: number; rewards: Reward[] }

const { deck, close } = defineProps<{
  deck: Deck
  close: (response?: StudySessionResponse) => void
}>()

function onSessionFinished(score: number, total: number) {
  const rewards: Reward[] = [{ type: 'paperclips', label: 'Paperclips', amount: 20 }]
  const payload: StudySessionResponse = { score, total, rewards }

  close(payload)
}
</script>

<template>
  <div
    data-testid="study-session"
    class="rounded-b-0 sm:rounded-b-8 rounded-t-8 shadow-lg overflow-hidden pb-4 relative bg-brown-300 dark:bg-grey-800 w-full h-full sm:h-auto sm:w-160"
  >
    <session :deck="deck" @closed="close" @finished="onSessionFinished" />
  </div>
</template>
