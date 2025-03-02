<template>
  <NavBar />
  <main class="max-w-358 h-full w-full px-4 sm:px-16 pt-7">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import NavBar from '@/components/TheNavBar.vue'
import { RouterView } from 'vue-router'
</script>
