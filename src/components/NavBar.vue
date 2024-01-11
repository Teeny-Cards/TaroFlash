<template>
  <nav class="w-full bg-green-400 sticky top-0 z-10">
    <div class="w-full max-w-screen-xl mx-auto px-8 py-3 flex justify-between items-center">
      <RouterLink to="/dashboard" class="text-xl font-semibold text-white">Teeny Cards</RouterLink>
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
