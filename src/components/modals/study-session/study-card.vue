<script setup lang="ts">
import Card from '@/components/card/index.vue'
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
      size="lg"
      :revealed="frontRevealed"
      :front_image_url="image_url"
      :back_text="card?.front_text"
      class="!border-brown-100"
    />
    <card
      size="lg"
      :revealed="backRevealed"
      :front_image_url="image_url"
      :back_text="card?.back_text"
      class="!border-brown-100"
    />
  </div>
</template>
