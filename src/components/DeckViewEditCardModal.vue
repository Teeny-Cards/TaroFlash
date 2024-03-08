<template>
  <div
    edit-card-modal
    class="w-full bg-orange rounded-4xl flex flex-col items-center justify-center gap-4 shadow-modal text-white py-4 bg-[url('../assets/img/stripe-orange.png')] bg-cover overflow-hidden"
  >
    <div edit-card-modal__title class="flex justify-center w-full">
      <h1 class="text-2xl font-semibold font-primary">Edit Card</h1>
    </div>
    <div edit-card-modal__body class="flex flex-col items-center w-full gap-2">
      <TeenyIcon src="expand-less" size="large"></TeenyIcon>

      <div
        edit-card-modal__body__card
        class="flex w-full gap-4 px-20 overflow-x-auto snap-mandatory snap-x scroll-hidden-x"
      >
        <TeenyCard size="large" class="text-2xl text-grey-dark snap-center">
          {{ currentCard.frontText }}
        </TeenyCard>
        <TeenyCard size="large" class="text-2xl text-grey-dark snap-center">
          {{ currentCard.backText }}
        </TeenyCard>
      </div>

      <TeenyIcon src="expand-more" size="large"></TeenyIcon>
    </div>
    <div edit-card-modal__actions class="w-full flex justify-center gap-2.5">
      <TeenyButton variant="muted" icon-left="close" @click="$emit('close')">Close</TeenyButton>
      <TeenyButton icon-left="check">Done</TeenyButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import TeenyIcon from '@/components/TeenyIcon.vue'
import TeenyCard from '@/components/TeenyCard.vue'
import TeenyButton from '@/components/TeenyButton.vue'
import { ref, type PropType } from 'vue'

const props = defineProps({
  cards: {
    type: Array as PropType<Card[]>,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

defineEmits<{ (e: 'close'): void }>()

const currentCard = ref(props.cards[props.index])
</script>
