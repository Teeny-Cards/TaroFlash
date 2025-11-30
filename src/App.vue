<template>
  <router-view />

  <teleport to="[toast-container]">
    <ui-toast v-for="(toast, index) in toasts" :key="index" :toast="toast" />
  </teleport>

  <teleport to="[data-testid='ui-kit-modal-container']">
    <ui-modal />
  </teleport>

  <div
    v-if="sessionStore.isLoading"
    class="absolute inset-0 z-100 flex items-center justify-center bg-green-400"
  >
    Loading
  </div>

  <dev-panel />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useToast } from '@/composables/toast'
import { useSessionStore } from '@/stores/session'
import UiToast from '@/components/ui-kit/toast.vue'
import UiModal from '@/components/ui-kit/modal.vue'
import DevPanel from '@/components/dev-panel.vue'

const sessionStore = useSessionStore()
const { toasts } = useToast()
</script>
