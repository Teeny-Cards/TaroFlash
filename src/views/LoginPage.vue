<template>
  <section class="w-full flex justify-center pt-32">
    <LoginDialogue signIn @signedIn="signIn" />
  </section>
</template>

<script setup lang="ts">
import { getAuth, signInWithEmailAndPassword, type UserCredential } from 'firebase/auth'
import LoginDialogue from '@/components/LoginDialogue.vue'
import { handleUserAuthStateChange } from '@/services/userService'
import router from '@/router'
import { ref } from 'vue'

const auth = getAuth()
const error = ref('false')

const signIn = (email: string, password: string): void => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential: UserCredential) => {
      handleUserAuthStateChange(userCredential.user)
      router.push({ name: 'dashboard' })
    })
    .catch((error) => {
      error.value = true
    })
}
</script>
