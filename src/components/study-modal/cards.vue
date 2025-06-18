<template>
  <div data-testid="study-modal__cards" class="flex gap-4">
    <Card size="large" :show-back="frontRevealed">{{ visibleCard?.front_text }}</Card>
    <Card size="large" :show-back="showBack">{{ visibleCard?.back_text }}</Card>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/card.vue'
import { watch, ref, onMounted, inject } from 'vue'
import { computed } from 'vue'

const { visibleCard, cardRevealed, studiedCardIds, failedCardIds } = defineProps<{
  visibleCard: Card | undefined
  cardRevealed: boolean
  studiedCardIds: Set<string>
  failedCardIds: Set<string>
}>()

const emit = defineEmits<{
  (e: 'cardRevealed', value: boolean): void
}>()

onMounted(() => {
  revealFront(200)
})

const frontRevealed = ref(false)
const backReavealed = ref(cardRevealed)

const showBack = computed(() => {
  return backReavealed.value || cardRevealed
})

function revealFront(timeout = 150) {
  setTimeout(() => {
    frontRevealed.value = true
    backReavealed.value =
      cardRevealed || studiedCardIds.has(visibleCard?.id!) || failedCardIds.has(visibleCard?.id!)
  }, timeout)
}

watch(
  () => visibleCard,
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
