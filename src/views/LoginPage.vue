<template>
  <section class="w-full flex justify-center pt-32">
    <LoginDialogue signIn @signedIn="loginWithEmail" />
  </section>
</template>

<script setup lang="ts">
import LoginDialogue from '@/components/login-dialog.vue'
import router from '@/router'
import { initUser } from '@/stores/initUser'
import { useSessionStore } from '@/stores/session'
import { useToastStore } from '@/stores/toast'
import { onMounted } from 'vue'

const session = useSessionStore()
const toastStore = useToastStore()

onMounted(async () => {
  const authenticated = await initUser()

  if (authenticated) {
    router.push({ name: 'dashboard' })
  }
})

async function loginWithEmail(email: string, password: string): Promise<void> {
  try {
    await session.login(email, password)
    router.push({ name: 'dashboard' })
  } catch (e: any) {
    toastStore.error(e.message)
  }
}
</script>
