<template>
  <section class="w-full flex justify-center pt-32">
    <LoginDialogue @signedUp="signUp" />
  </section>
</template>

<script setup lang="ts">
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import LoginDialogue from '@/components/LoginDialogue.vue'

const auth = getAuth()

const signUp = (email: string, password: string): void => {
  console.log('sign up')
  // createUserWithEmailAndPassword(auth, email, password)
  //   .then((userCredential) => {
  //     var user = userCredential.user
  //   })
  //   .catch((error) => {
  //     var errorCode = error.code
  //     var errorMessage = error.message
  //   })
}
</script>
