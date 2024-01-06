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
  createUserWithEmailAndPassword(auth, email, password).catch((error) => {
    var errorCode = error.code
    var errorMessage = error.message
  })
}
</script>
