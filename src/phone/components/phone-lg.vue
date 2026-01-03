<script setup lang="ts">
import { type PhoneContext } from '@/phone/system/types'
import { computed, inject } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const phone_context = inject<PhoneContext>('phone-context')
const nav = phone_context?.nav

const current_app = computed(() => nav?.top.value)
</script>

<template>
  <div
    data-testid="phone-lg"
    class="pointer-events-auto w-223.75 h-150 bg-brown-300 rounded-16 shadow-sm"
  >
    <component v-if="current_app" :is="current_app.component" @close="emit('close')" />
  </div>
</template>
