<template>
  <section class="w-full flex justify-center pt-32">
    <LoginDialogue signIn @signedIn="signInWithEmail" />
  </section>
</template>

<script setup lang="ts">
import LoginDialogue from '@/components/LoginDialogue.vue'
import { useMemberStore } from '@/stores/member'
import router from '@/router'
import { supabase } from '@/supabaseClient'

const user = useMemberStore()

async function signInWithEmail(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    throw new Error(error.message)
  }

  await user.login()

  if (user.authenticated) {
    router.push({ name: 'dashboard' })
  }
}
</script>
