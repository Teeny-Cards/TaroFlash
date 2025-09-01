<script setup lang="ts">
import Paperclips from './paperclips.vue'
import RewardDialog from './reward-dialog.vue'

const { rewards, score, total } = defineProps<{
  rewards: Reward[]
  score: number
  total: number
}>()

const reward_components = {
  paperclips: Paperclips,
  powerup: {}
}
</script>

<template>
  <div class="flex flex-col">
    <div class="drop-shadow-modal">
      <component v-for="reward in rewards" :is="reward_components[reward.type]" :reward="reward" />
    </div>

    <reward-dialog
      class="drop-shadow-overlay"
      :score="score"
      :total="total"
      :num_rewards="rewards.length"
      :first_reward="rewards[0]"
    />
  </div>
</template>
