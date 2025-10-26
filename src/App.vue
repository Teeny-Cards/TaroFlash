<template>
  <RouterView />

  <div
    v-if="sessionStore.isLoading"
    class="absolute inset-0 z-10 flex items-center justify-center bg-green-400"
  >
    Loading
  </div>

  <teleport to="[toast-container]">
    <ui-toast v-for="(toast, index) in toasts" :key="index" :toast="toast" />
  </teleport>

  <teleport to="[data-testid='ui-kit-modal-container']">
    <ui-modal />
  </teleport>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores/toast'
import { useSessionStore } from '@/stores/session'
import UiToast from '@/components/ui-kit/toast.vue'
import UiModal from '@/components/ui-kit/modal.vue'

const sessionStore = useSessionStore()
const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)
</script>
