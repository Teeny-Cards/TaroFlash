<template>
  <div teeny-dropdown class="relative">
    <slot name="trigger" :toggle="toggle"></slot>
    <div v-if="open" class="absolute z-10 mt-2 right-0 bg-white p-2 w-max">
      <slot name="dropdown"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)

function toggle(): void {
  open.value = !open.value
  document.addEventListener('click', close)
}

function close(e: Event) {
  const target = e.target as HTMLElement

  if (!target.hasAttribute('teeny-dropdown')) {
    open.value = false
    document.removeEventListener('click', close)
  }
}
</script>
