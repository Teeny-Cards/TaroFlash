<template>
  <div
    teeny-toast-manager
    class="absolute inset-0 z-50 flex flex-col items-end gap-2 p-4 pt-16 pointer-events-none"
  >
    <TeenyToast v-for="(toast, index) in toasts" :key="index" :toast="toast" @close="onCloseToast">
    </TeenyToast>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
import { storeToRefs } from 'pinia'
import TeenyToast from '@/components//TeenyToast.vue'

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)

function onCloseToast(toast: TeenyToast): void {
  toastStore.removeToast(toast)
}
</script>
