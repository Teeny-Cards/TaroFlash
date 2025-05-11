<template>
  <div data-testid="study-modal__cards" class="flex gap-4">
    <Card size="large" :show-back="frontRevealed">{{ currentCard?.front_text }}</Card>
    <Card size="large" :show-back="cardRevealed">{{ currentCard?.back_text }}</Card>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/card.vue'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { watch } from 'vue'
import { type PropType } from 'vue'

const props = defineProps({
  currentCard: Object as PropType<Card>,
  cardRevealed: Boolean
})

const emit = defineEmits<{
  (e: 'cardRevealed', value: boolean): void
}>()

onMounted(() => {
  revealFront(200)
})

const frontRevealed = ref(false)

function revealFront(timeout = 150) {
  const startTime = performance.now()

  function animate(currentTime: DOMHighResTimeStamp) {
    if (currentTime - startTime >= timeout) {
      frontRevealed.value = true
      return
    }
    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}

watch(
  () => props.currentCard,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      frontRevealed.value = false
      revealFront(350)
      emit('cardRevealed', false)
    }
  }
)
</script>
