<script setup lang="ts">
const { reward } = defineProps<{ reward: Reward }>()
</script>

<template>
  <div
    class="aspect-card rounded-14 border-brown-300 flex w-80 flex-col items-center justify-between border-8
      bg-blue-500 bg-(image:--aztec) bg-size-[12%]"
  >
    <div class="paperclip-value">
      <h2>{{ reward.amount }}</h2>
    </div>
    <img class="w-50" src="@/assets/images/paperclip-reward.png" />
    <div class="paperclip-value paperclip-value--right">
      <h2>{{ reward.amount }}</h2>
    </div>
  </div>
</template>

<style>
.paperclip-value {
  display: flex;
  width: 100%;
  padding: 26px;

  font-size: var(--text-6xl);
  line-height: var(--text-7xl--line-height);
  color: var(--color-brown-100);
}
.paperclip-value--right {
  justify-content: flex-end;
}
</style>
