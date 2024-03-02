<template>
  <nav class="w-full bg-blue font-primary sticky top-0 z-10">
    <div class="w-full max-w-app mx-auto px-8 py-4 flex justify-between items-center">
      <RouterLink to="/dashboard" class="text-4xl text-white">TeenyCards</RouterLink>
      <div class="flex gap-3 items-center">
        <RouterLink to="/dashboard" class="text-white">Dashboard</RouterLink>
        <RouterLink to="/create" class="text-white">Create</RouterLink>
        <button @click="onClick" class="text-white">Sign Out</button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { getAuth, signOut } from 'firebase/auth'
import router from '@/router'

function onClick(): void {
  const auth = getAuth()
  signOut(auth)
    .then(() => {
      router.push({ name: 'signin' })
    })
    .catch((error) => {
      console.error(error)
    })
}
</script>
