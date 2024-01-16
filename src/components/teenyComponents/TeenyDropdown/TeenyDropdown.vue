<template>
  <div class="relative" ref="teenyDropdown">
    <TeenyButton :color="triggerColor" :variant="triggerVariant" @onClick="toggleDropdown">
      <slot name="trigger"></slot>
    </TeenyButton>
    <div
      v-if="dropdownVisible"
      class="absolute z-10 right-0 top-full mt-2 shadow-md bg-white rounded-xl"
    >
      <slot name="dropdown"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { onMounted } from 'vue'

defineProps({
  triggerColor: String,
  triggerVariant: String
})

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

const teenyDropdown = ref<HTMLDivElement>()
const dropdownVisible = ref(false)

function toggleDropdown(): void {
  dropdownVisible.value = !dropdownVisible.value
}

function closeDropdown(e: MouseEvent): void {
  const clickedElement = e.target as Node

  if (!teenyDropdown.value?.contains(clickedElement)) {
    dropdownVisible.value = false
  }
}
</script>
