<template>
  <div uikit-toast-manager>
    <teleport to="[teeny-toast-container]">
      <ui-kit:toast
        v-for="(toast, index) in toasts"
        :key="index"
        :toast="toast"
        @close="onCloseToast"
      />
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'

const messageStore = useMessageStore()
const { toasts } = storeToRefs(messageStore)

function onCloseToast(toast: any): void {
  messageStore.removeToast(toast)
}
</script>
@/stores/message
