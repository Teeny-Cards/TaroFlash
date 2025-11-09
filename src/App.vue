<template>
  <nav-bar />

  <main class="h-full w-full max-w-(--page-width) px-4 sm:px-16">
    <router-view />
  </main>

  <div
    data-testid="phone-container"
    class="fixed inset-0 z-100 flex justify-center pointer-events-none"
  >
    <div class="w-full max-w-(--page-width) flex justify-end mx-4 sm:mx-10 mt-3 relative">
      <phone />
    </div>
  </div>

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
</template>

<script setup lang="ts">
import NavBar from '@/components/nav-bar.vue'
import { RouterView } from 'vue-router'
import { useToast } from '@/composables/toast'
import { useSessionStore } from '@/stores/session'
import UiToast from '@/components/ui-kit/toast.vue'
import UiModal from '@/components/ui-kit/modal.vue'
import Phone from '@/components/phone/phone.vue'

const sessionStore = useSessionStore()
const { toasts } = useToast()
</script>
