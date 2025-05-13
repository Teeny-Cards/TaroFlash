<template>
  <div data-testid="study-modal__cards" class="flex gap-4">
    <Card size="large" :show-back="frontRevealed">{{ studySession?.visibleCard?.front_text }}</Card>
    <Card size="large" :show-back="showBack">{{ studySession?.visibleCard?.back_text }}</Card>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/card.vue'
import { watch, ref, onMounted, inject } from 'vue'
import type { StudySession } from './index.vue'
import { computed } from 'vue';

const emit = defineEmits<{
  (e: 'cardRevealed', value: boolean): void
}>()

onMounted(() => {
  revealFront(200)
})

const studySession = inject<StudySession>('studySession')
const frontRevealed = ref(false)
const backReavealed = ref(studySession?.cardRevealed)

const showBack = computed(() => {
  return backReavealed.value || studySession?.cardRevealed
})

function revealFront(timeout = 150) {
  setTimeout(() => {
    frontRevealed.value = true
    backReavealed.value =
      studySession?.cardRevealed ||
      studySession?.studiedCardIds.has(studySession?.visibleCard?.id!) ||
      studySession?.failedCardIds.has(studySession?.visibleCard?.id!)
  }, timeout)
}

watch(
  () => studySession?.visibleCard,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      frontRevealed.value = false
      backReavealed.value = false
      revealFront(350)
      emit('cardRevealed', false)
    }
  }
)
</script>
