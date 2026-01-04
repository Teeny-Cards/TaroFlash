<script setup lang="ts">
import { type AppSession } from '@/phone/system/runtime'
import { computed } from 'vue'

const { active_session } = defineProps<{
  active_session: AppSession | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const current_app = computed(() => {
  return active_session?.app.type === 'view' ? active_session.app : null
})
</script>

<template>
  <div
    data-testid="phone-lg"
    class="pointer-events-auto w-223.75 h-150 bg-brown-300 dark:bg-grey-700 rounded-16 shadow-sm"
  >
    <component v-if="current_app" :is="current_app.component" @close="emit('close')" />
  </div>
</template>
