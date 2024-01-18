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
  //TODO: do some more here
  createUserWithEmailAndPassword(auth, email, password).catch((error) => {
    //TODO: Form error message
  })
}
</script>
