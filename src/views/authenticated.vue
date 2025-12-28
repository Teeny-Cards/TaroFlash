<script setup lang="ts">
import NavBar from '@/components/nav-bar.vue'
import Phone from '@/phone/phone.vue'
</script>

<template>
  <nav-bar />
  <main class="h-full w-full max-w-(--page-width) px-4 sm:px-16">
    <router-view />
  </main>

  <phone />
</template>
