<script setup lang="ts">
import { ref } from 'vue'
import Session from './session.vue'
import StartScreen from './start-screen.vue'
import RewardDialog from '../reward-dialog/index.vue'

const { deck, close } = defineProps<{ deck: Deck; close: (response?: any) => void }>()

type Stage = 'studying' | 'completed'

const stage = ref<Stage>('studying')
const score = ref(0)
const total = ref(0)
const rewards = ref<Reward[]>([])

function onSessionFinished(_score: number, _total: number) {
  score.value = _score
  total.value = _total
  rewards.value = [{ type: 'paperclips', label: 'Paperclips', amount: 20 }]
  stage.value = 'completed'
}
</script>

<template>
  <div
    data-testid="study-session"
    class="rounded-b-0 sm:rounded-b-8 rounded-t-8 shadow-lg overflow-hidden pb-4 relative bg-brown-300 dark:bg-grey-800 w-full h-full sm:h-auto sm:w-160"
  >
    <session
      v-if="stage === 'studying'"
      :deck="deck"
      @closed="close"
      @finished="onSessionFinished"
    />
    <reward-dialog
      v-else-if="stage === 'completed'"
      :rewards="rewards"
      :score="score"
      :total="total"
    />
  </div>
</template>
