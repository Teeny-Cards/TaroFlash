<template>
  <div
    class="w-[284px] aspect-card rounded-[36px] bg-white shadow-lg border border-gray-100 flex justify-center items-center p-3"
  >
    <input
      class="w-full h-full text-center align-middle focus:outline-none text-3xl bg-transparent"
      :placeholder="props.placeholder"
      @input="onChange"
      v-model="value"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  placeholder: String,
  order: {
    type: Number,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'input', order: number, value: string): void
}>()

const value = ref('')

function onChange(): void {
  emit('input', props.order, value.value)
}
</script>
