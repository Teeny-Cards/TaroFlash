<template>
  <TeenyCard size="large" class="snap-center overflow-hidden">
    <div class="relative flex items-center justify-center w-full h-full">
      <TeenyIcon
        src="add-image"
        size="large"
        class="absolute cursor-pointer text-orange top-4 left-4"
      />
      <textarea
        teeny-card-editor__input="front"
        name="front_text"
        class="w-full text-2xl text-center bg-transparent resize-none text-grey-dark focus:outline-hidden"
        rows="1"
        placeholder="Front"
        :value="card.front_text"
        @input="onFrontChanged"
        ref="frontCardInput"
      />
    </div>
  </TeenyCard>
  <TeenyCard size="large" class="snap-center overflow-hidden">
    <textarea
      teeny-card-editor__input="back"
      name="back_text"
      class="w-full text-2xl text-center bg-transparent resize-none focus:outline-hidden text-grey-dark"
      rows="1"
      placeholder="Back"
      :value="card.back_text"
      @input="onBackChanged"
      ref="backCardInput"
    />
  </TeenyCard>
</template>

<script setup lang="ts">
import TeenyCard from './TeenyCard.vue'
import TeenyIcon from './TeenyIcon.vue'
import { onMounted, ref, type PropType } from 'vue'

const props = defineProps({
  card: {
    type: Object as PropType<Card>,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'frontInput', card: Card, value: string): void
  (e: 'backInput', card: Card, value: string): void
}>()

const frontCardInput = ref<HTMLInputElement>()
const backCardInput = ref<HTMLInputElement>()

onMounted(() => {
  if (frontCardInput.value) {
    updateInputHeight(frontCardInput.value)
  }

  if (backCardInput.value) {
    updateInputHeight(backCardInput.value)
  }
})

function onFrontChanged(e: Event): void {
  const target = e.target as HTMLInputElement
  emit('frontInput', props.card, target.value)
  updateInputHeight(target)
}

function onBackChanged(e: Event): void {
  const target = e.target as HTMLInputElement
  emit('backInput', props.card, target.value)
  updateInputHeight(target)
}

function updateInputHeight(el: HTMLInputElement): void {
  const parent = el.parentElement

  if (!parent) return

  const parentStyle = window.getComputedStyle(parent)
  const parentHeight = parent.clientHeight - parseFloat(parentStyle.paddingTop) * 2

  el.style.height = 'auto' // reset
  el.style.height = `${Math.min(el.scrollHeight, parentHeight)}px`
}
</script>
