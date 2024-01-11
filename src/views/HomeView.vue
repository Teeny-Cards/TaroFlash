<template>
  <NavBar />
  <main class="max-w-screen-2.5xl mx-auto h-full w-full">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
import { RouterView } from 'vue-router'
</script>
