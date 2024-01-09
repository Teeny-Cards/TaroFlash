<template>
  <div class="flex gap-8 justify-around items-center w-full">
    <h2 class="text-3xl font-semibold text-gray-400">{{ card.order + 1 }}</h2>
    <div class="flex gap-8 justify-center items-center">
      <TeenyCard>
        <div class="w-full h-full relative group">
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
          <input
            class="w-full h-full text-center align-middle focus:outline-none text-3xl bg-transparent"
            placeholder="Front"
            :value="card.frontText"
            @input="onFrontChanged"
          />
        </div>
      </TeenyCard>
      <TeenyCard>
        <input
          class="w-full h-full text-center align-middle focus:outline-none text-3xl bg-transparent"
          placeholder="Back"
          :value="card.backText"
          @input="onBackChanged"
        />
      </TeenyCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'

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
}>()

function onFrontChanged(e: Event): void {
  const target = e.target as HTMLInputElement
  emit('frontInput', props.index, target.value)
}

function onBackChanged(e: Event): void {
  const target = e.target as HTMLInputElement
  emit('backInput', props.index, target.value)
}
</script>
