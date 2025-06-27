<template>
  <Card size="large" class="snap-center overflow-hidden" :revealed="true">
    <div class="relative flex h-full w-full items-center justify-center">
      <ui-kit:icon
        src="add-image"
        size="large"
        class="text-orange absolute top-4 left-4 cursor-pointer"
      />
      <textarea
        teeny-card-editor__input="front"
        name="front_text"
        class="text-grey-dark w-full resize-none bg-transparent text-center text-3xl focus:outline-hidden"
        rows="1"
        :placeholder="$t('card.placeholder-front')"
        :value="card.front_text"
        @input="onFrontChanged"
        ref="frontCardInput"
      />
    </div>
  </Card>
  <Card size="large" class="snap-center overflow-hidden" :revealed="true">
    <textarea
      teeny-card-editor__input="back"
      name="back_text"
      class="text-grey-dark w-full resize-none bg-transparent text-center text-3xl focus:outline-hidden"
      rows="1"
      :placeholder="$t('card.placeholder-back')"
      :value="card.back_text"
      @input="onBackChanged"
      ref="backCardInput"
    />
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/card.vue'
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
