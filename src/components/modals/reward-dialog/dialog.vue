<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import UiButton from '@/components/ui-kit/button.vue'

const { score, total, num_rewards, first_reward } = defineProps<{
  score: number
  total: number
  num_rewards: number
  first_reward: Reward
}>()

const { t } = useI18n()

const DEFAULT_HEADER = t('reward-stack.dang')

const bucket = computed(() => Math.floor(percentage.value / 10) * 10)

const headers: Record<number, string> = {
  100: t('reward-stack.perfect-score'),
  90: t('reward-stack.great-job'),
  80: t('reward-stack.good-work'),
  70: t('reward-stack.not-bad')
  // others fall back to default
}

const subheader = computed(() => {
  const args = {
    count: first_reward.amount,
    type: first_reward.label
  }

  return num_rewards > 1
    ? t('reward-stack.multi-reward.subheader', args)
    : t('reward-stack.single-reward.subheader', args)
})

const percentage = computed(() => {
  if (!Number.isFinite(score) || !Number.isFinite(total) || total <= 0) return 0
  return Math.max(0, Math.min(100, Math.round((score / total) * 100)))
})
</script>

<template>
  <div
    class="bg-brown-300 rounded-5 -mt-10 h-16 w-full outline-8 outline-brown-300 p-1 flex gap-4 relative"
  >
    <div
      class="flex h-full p-2 bg-blue-500 outline-4 outline-white rounded-4.5 items-center justify-center
        text-white"
    >
      <div class="flex items-end">
        <p class="text-3xl">
          {{ score }}<span class="text-sm">/{{ total }}</span>
        </p>
      </div>
    </div>
    <div class="flex flex-col gap-1">
      <h1 class="text-brown-700 text-3xl">{{ headers[bucket] ?? DEFAULT_HEADER }}</h1>
      <p class="text-brown-700 text-sm [&>span]:text-blue-500" v-html="subheader"></p>
    </div>
    <ui-button
      icon-left="check"
      size="small"
      class="absolute -bottom-2 -right-2 outline-brown-300 outline-6"
      >{{ t('common.done') }}</ui-button
    >
  </div>
</template>
