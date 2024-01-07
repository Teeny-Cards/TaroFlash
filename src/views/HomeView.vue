<template>
  <NavBar />
  <main class="max-w-screen-xl mx-auto">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
import { RouterView } from 'vue-router'
</script>
