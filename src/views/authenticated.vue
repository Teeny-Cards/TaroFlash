<script setup lang="ts">
import NavBar from '@/components/nav-bar.vue'
import Phone from '@/components/phone/phone.vue'
</script>

<template>
  <nav-bar />
  <main class="h-full w-full max-w-(--page-width) px-4 sm:px-16">
    <router-view />
  </main>

  <div
    data-testid="phone-container"
    class="fixed inset-0 z-100 flex justify-center pointer-events-none"
  >
    <div class="w-full max-w-(--page-width) flex justify-end mx-4 sm:mx-10 mt-3 relative">
      <phone />
    </div>
  </div>
</template>
