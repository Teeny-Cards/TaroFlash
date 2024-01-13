<template>
  <div class="flex gap-8 justify-around items-center w-full relative group">
    <h2 class="text-3xl font-semibold text-gray-400">{{ index + 1 }}</h2>
    <div class="flex gap-8 justify-center items-center">
      <TeenyCard>
        <div class="w-full h-full flex justify-center items-center relative group">
          <div
            class="absolute top-2 left-2 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" viewBox="0 -960 960 960">
              <path
                d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h360v80H200v560h560v-360h80v360q0 33-23.5 56.5T760-120H200Zm480-480v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM240-280h480L570-480 450-320l-90-120-120 160Zm-40-480v560-560Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <textarea
            class="w-full text-center focus:outline-none text-3xl bg-transparent resize-none"
            rows="1"
            placeholder="Front"
            :value="card.frontText"
            @input="onFrontChanged"
            ref="frontCardInput"
          />
        </div>
      </TeenyCard>
      <TeenyCard>
        <textarea
          class="w-full text-center focus:outline-none text-3xl bg-transparent resize-none"
          rows="1"
          placeholder="Back"
          :value="card.backText"
          @input="onBackChanged"
          ref="backCardInput"
        />
      </TeenyCard>
    </div>
    <TeenyButton
      color="danger"
      variant="ghost"
      class="absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity"
      @onClick="$emit('delete', index)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path
          d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
          fill="currentColor"
        />
      </svg>
    </TeenyButton>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type PropType } from 'vue'

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  card: {
    type: Object as PropType<Card>,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'frontInput', index: number, value: string): void
  (e: 'backInput', index: number, value: string): void
  (e: 'delete', index: number): void
}>()

const frontCardInput = ref()
const backCardInput = ref()

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
  emit('frontInput', props.index, target.value)
  updateInputHeight(target)
}

function onBackChanged(e: Event): void {
  const target = e.target as HTMLInputElement
  emit('backInput', props.index, target.value)
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
