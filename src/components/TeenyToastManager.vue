<template>
  <div teeny-toast-manager>
    <teleport to="[teeny-toast-container]">
      <TeenyToast
        v-for="(toast, index) in toasts"
        :key="index"
        :toast="toast"
        @close="onCloseToast"
      />
    </teleport>
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
