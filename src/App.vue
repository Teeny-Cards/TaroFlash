<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useToast } from '@/composables/toast'
import UiToast from '@/components/ui-kit/toast.vue'
import UiModal from '@/components/ui-kit/modal.vue'
import audio_player from '@/sfx/player'
import { useSessionStore } from '@/stores/session'
import { onMounted } from 'vue'
import logger from '@/utils/logger'
import { useTheme } from '@/composables/use-theme'

const { toasts } = useToast()
const session = useSessionStore()
const theme = useTheme()

onMounted(async () => {
  try {
    theme.load()
    session.startLoading()
    await audio_player.setup()
  } catch (e: any) {
    logger.error(e.message, e)
  } finally {
    session.stopLoading()
  }
})
</script>

<template>
  <router-view />

  <teleport to="[toast-container]">
    <ui-toast v-for="(toast, index) in toasts" :key="index" :toast="toast" />
  </teleport>

  <teleport to="[data-testid='app-modal-container']">
    <ui-modal />
  </teleport>
</template>
