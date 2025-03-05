<template>
  <section class="w-full flex justify-center pt-32">
    <LoginDialogue @signedUp="signUpNewUser" />
  </section>
</template>

<script setup lang="ts">
import LoginDialogue from '@/components/LoginDialogue.vue'
import { supabase } from '@/supabaseClient'
import { TeenyError } from '@/utils/TeenyError'

async function signUpNewUser(email: string, password: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) {
    throw new TeenyError(error.message)
  }
}
</script>
