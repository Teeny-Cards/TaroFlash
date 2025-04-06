<template>
  <section class="w-full h-screen flex items-center justify-center">Loading...</section>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useSessionStore } from '@/stores/session'
import { useMemberStore } from '@/stores/member'
import router from '@/router'
import { useRoute } from 'vue-router'
import Logger from '@/utils/logger'

const route = useRoute()

const session = useSessionStore()
const memberStore = useMemberStore()

onMounted(async () => {
  await initUser()

  if (session.authenticated) {
    const path = route.query.path?.toString() ?? '/dashboard'

    Logger.info(`User is authenticated, redirecting to ${path}`)
    router.replace(path)
  }
})

async function initUser() {
  try {
    await session.restoreSession()

    if (session.authenticated && session.user?.id) {
      await memberStore.fetchMember()
    }
  } catch (e: any) {
    Logger.error(`Error initializing user: ${e.message}`)
  }
}
</script>
