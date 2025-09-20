<script setup lang="ts">
import { ref } from 'vue'
import Session from './session.vue'
import SessionRewardDialog from '../session-reward-dialog/index.vue'

const { deck, close } = defineProps<{ deck: Deck; close: (response?: any) => void }>()

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
  <Session v-if="is_studying" :deck="deck" @closed="close" @finished="onSessionFinished" />
  <SessionRewardDialog
    v-else-if="rewards.length > 0"
    :rewards="rewards"
    :score="score"
    :total="total"
  />
</template>
