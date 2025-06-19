<script setup lang="ts">
import Card from '@/components/card.vue'
import { watch, ref, onMounted } from 'vue'

const { card, revealed } = defineProps<{
  card: Card | undefined
  revealed: boolean
}>()

const emit = defineEmits<{
  (e: 'cardRevealed', value: boolean): void
}>()

onMounted(() => {
  revealFront(200)
})

const frontRevealed = ref(false)

function revealFront(timeout = 150) {
  setTimeout(() => {
    frontRevealed.value = true
  }, timeout)
}

watch(
  () => card,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      frontRevealed.value = false
      revealFront(350)
      emit('cardRevealed', false)
    }
  }
)
</script>

<template>
  <div data-testid="study-modal__cards" class="flex gap-4">
    <Card size="large" :show-back="frontRevealed">{{ card?.front_text }}</Card>
    <Card size="large" :show-back="revealed">{{ card?.back_text }}</Card>
  </div>
</template>
