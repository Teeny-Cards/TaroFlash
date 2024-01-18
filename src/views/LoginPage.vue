<template>
  <section class="w-full flex justify-center pt-32">
    <LoginDialogue signIn @signedIn="signIn" />
  </section>
</template>

<script setup lang="ts">
import { getAuth, signInWithEmailAndPassword, type UserCredential } from 'firebase/auth'
import LoginDialogue from '@/components/LoginDialogue.vue'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const auth = getAuth()
const user = useUserStore()

const signIn = async (email: string, password: string): Promise<void> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password)
    await user.login(userCredential.user)

    if (user.authenticated) {
      router.push({ name: 'dashboard' })
    } else {
      // TODO: Form error message
    }
  } catch (e) {
    // TODO: Form error message
  }
}
</script>
