<script setup lang="ts">
import Card from '@/components/card.vue'
import { watch, ref, onMounted } from 'vue'

const { card, revealed, previewing } = defineProps<{
  card?: Card
  image_url?: string
  revealed: boolean
  previewing: boolean
}>()

onMounted(() => {
  animateFront(200)
  animateBack(200)
})

const frontRevealed = ref(false)
const backRevealed = ref(revealed || previewing)

function animateFront(timeout = 150) {
  frontRevealed.value = false

  setTimeout(() => {
    frontRevealed.value = true
  }, timeout)
}

function animateBack(timeout = 150) {
  backRevealed.value = false

  setTimeout(() => {
    backRevealed.value = revealed || previewing
  }, timeout)
}

watch(
  () => [card, revealed, previewing],
  ([newCard, newRevealed], [oldCard, oldRevealed]) => {
    if (newCard !== oldCard) {
      animateFront(350)
    }

    const instantReveal = !oldRevealed && newRevealed && !previewing
    animateBack(instantReveal ? 0 : 350)
  }
)
</script>

<template>
  <div data-testid="study-card" class="flex gap-4">
    <card
      data-testid="study-card__front"
      size="large"
      :revealed="frontRevealed"
      :image_url="image_url"
      class="!border-brown-100"
    >
      {{ card?.front_text }}
    </card>
    <card
      data-testid="study-card__back"
      size="large"
      :revealed="backRevealed"
      :image_url="image_url"
      class="!border-brown-100"
    >
      {{ card?.back_text }}
    </card>
  </div>
</template>
