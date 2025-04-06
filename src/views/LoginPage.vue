<template>
  <section class="w-full flex justify-center pt-32">
    <LoginDialogue signIn @signedIn="signInWithEmail" />
  </section>
</template>

<script setup lang="ts">
import LoginDialogue from '@/components/LoginDialogue.vue'
import router from '@/router'
import { useSessionStore } from '@/stores/session'

const session = useSessionStore()

async function signInWithEmail(email: string, password: string): Promise<void> {
  try {
    await session.login(email, password)
  } catch (e: any) {
    throw e
  }

  router.push({ name: 'dashboard' })
}
</script>
