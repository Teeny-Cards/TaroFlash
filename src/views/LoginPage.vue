<template>
  <section class="w-full flex justify-center pt-32">
    <LoginDialogue signIn @signedIn="signIn" />
  </section>
</template>

<script setup lang="ts">
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import LoginDialogue from '@/components/LoginDialogue.vue'

const auth = getAuth()

const signIn = (email: string, password: string): void => {
  console.log('sign in')
  // signInWithEmailAndPassword(auth, email, password)
  //   .then((userCredential) => {
  //     var user = userCredential.user
  //   })
  //   .catch((error) => {
  //     var errorCode = error.code
  //     var errorMessage = error.message
  //   })
}
</script>
