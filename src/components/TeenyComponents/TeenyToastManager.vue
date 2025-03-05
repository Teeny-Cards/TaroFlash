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
import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'
import TeenyToast from './TeenyToast.vue'

const messageStore = useMessageStore()
const { toasts } = storeToRefs(messageStore)

function onCloseToast(toast: TeenyToast): void {
  messageStore.removeToast(toast)
}
</script>
@/stores/message
