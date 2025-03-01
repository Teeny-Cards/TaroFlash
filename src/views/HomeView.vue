<template>
  <NavBar />
  <main class="max-w-[theme(screens.2.5xl)] h-full w-full">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import NavBar from '@/components/TheNavBar.vue'
import { RouterView } from 'vue-router'
</script>
