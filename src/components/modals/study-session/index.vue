<script setup lang="ts">
import { ref } from 'vue'
import Session from './session.vue'
import StartScreen from './start-screen.vue'
import RewardDialog from '../reward-dialog/index.vue'

const { deck, close } = defineProps<{ deck: Deck; close: (response?: any) => void }>()

const is_started = ref(false)
const is_studying = ref(true)
const score = ref(0)
const total = ref(0)
const rewards = ref<Reward[]>([])

function onSessionFinished(_score: number, _total: number) {
  is_studying.value = false
  score.value = _score
  total.value = _total

  rewards.value = [{ type: 'paperclips', label: 'Paperclips', amount: 20 }]
}
</script>

<template>
  <div
    data-testid="study-session"
    class="rounded-b-0 sm:rounded-b-8 rounded-t-8 shadow-lg flex flex-col gap-6 items-center justify-between overflow-hidden pb-10 relative bg-brown-300 dark:bg-grey-800 w-full h-full sm:h-auto sm:w-160"
  >
    <start-screen v-if="!is_started" :deck="deck" @started="is_started = true" @closed="close" />
    <session v-else-if="is_studying" :deck="deck" @closed="close" @finished="onSessionFinished" />
    <reward-dialog v-else-if="rewards.length > 0" :rewards="rewards" :score="score" :total="total" />
  </div>
</template>
