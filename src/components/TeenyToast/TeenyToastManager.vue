<template>
  <div class="absolute inset-0 pointer-events-none flex flex-col gap-2 items-end p-4 pt-16 z-50">
    <TeenyToast v-for="(toast, index) in toasts" :key="index" :toast="toast" @close="onCloseToast">
    </TeenyToast>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
import { storeToRefs } from 'pinia'
import TeenyToast from './TeenyToast.vue'

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)

function onCloseToast(toast: TeenyToast): void {
  toastStore.removeToast(toast)
}
</script>
