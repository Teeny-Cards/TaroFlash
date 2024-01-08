<template>
  <div class="flex gap-8 justify-around items-center w-full">
    <h2 class="text-3xl font-semibold text-gray-400">{{ card.order + 1 }}</h2>
    <div class="flex gap-8 justify-center items-center">
      <TeenyCard>
        <input
          class="w-full h-full text-center align-middle focus:outline-none text-3xl bg-transparent"
          placeholder="Front"
          v-model="frontText"
          @input="onChange"
        />
      </TeenyCard>
      <TeenyCard>
        <input
          class="w-full h-full text-center align-middle focus:outline-none text-3xl bg-transparent"
          placeholder="Back"
          v-model="backText"
          @input="onChange"
        />
      </TeenyCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import TeenyCard from './TeenyCard.vue'
import { ref, type PropType } from 'vue'

const props = defineProps({
  card: {
    type: Object as PropType<Card>,
    required: true
  }
})

const frontText = ref(props.card.frontText)
const backText = ref(props.card.backText)

const emit = defineEmits<{
  (e: 'input', id: number, value: { front: string; back: string }): void
}>()

function onChange(): void {
  emit('input', props.card.order, { front: frontText.value, back: backText.value })
}
</script>
