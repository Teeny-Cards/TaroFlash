<script setup lang="ts">
import NavBar from '@/components/nav-bar.vue'
import Phone from '@/phone/phone.vue'
import UiLoader from '@/components/ui-kit/loader.vue'
import { useSessionStore } from '@/stores/session'

const session = useSessionStore()
</script>

<template>
  <ui-loader
    :loading="session.isLoading"
    :delay-ms="1000"
    loading-image="logo"
    size="lg"
    theme="blue-500"
    theme-dark="grey-900"
    class="absolute inset-0 text-white"
  >
    <nav-bar />
    <phone />

    <main class="h-full w-full max-w-(--page-width) px-4 sm:px-16">
      <router-view />
    </main>
  </ui-loader>
</template>
