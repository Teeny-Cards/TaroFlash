<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useToast } from '@/composables/toast'
import UiToast from '@/components/ui-kit/toast.vue'
import UiModal from '@/components/ui-kit/modal.vue'
import audio_player from '@/sfx/player'
import { installAudioLifecycle } from '@/sfx/lifecycle'
import { useSessionStore } from '@/stores/session'
import { onMounted, onBeforeUnmount } from 'vue'
import logger from '@/utils/logger'
import { useThemeStore } from '@/stores/theme'
import { useRouter } from 'vue-router'
import { clearStaticLoader } from '@/utils/static-loader'

const { toasts } = useToast()
const session = useSessionStore()
const theme = useThemeStore()
const router = useRouter()

const removeGuard = router.afterEach((to) => {
  const isAuthenticated = to.matched.some((r) => r.name === 'authenticated')
  if (!isAuthenticated) {
    clearStaticLoader()
    removeGuard()
  }
})

let teardownAudioLifecycle: (() => void) | undefined

onMounted(async () => {
  try {
    theme.load()
    session.startLoading()
    await audio_player.setup()
    teardownAudioLifecycle = installAudioLifecycle()
  } catch (e: any) {
    logger.error(e.message, e)
  } finally {
    session.stopLoading()
  }
})

onBeforeUnmount(() => {
  teardownAudioLifecycle?.()
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
