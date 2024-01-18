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

const signIn = (email: string, password: string): void => {
  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential: UserCredential) => {
      const user = useUserStore()
      user.login(userCredential.user)

      if (user.authenticated) {
        router.push({ name: 'dashboard' })
      } else {
        // TODO: fail toast
      }
    })
    .catch((e) => {
      // TODO: Fail toast
    })
}
</script>
