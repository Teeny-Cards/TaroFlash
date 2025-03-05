<template>
  <section class="w-full h-screen flex items-center justify-center">Loading...</section>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import router from '@/router'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

const route = useRoute()
const path = route.query.path as string

const userStore = useUserStore()
const { authenticated } = storeToRefs(userStore)

onMounted(() => {
  if (authenticated.value) {
    router.replace(path ?? '/dashboard')
  }
})

watch(authenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    router.replace(path ?? '/dashboard')
  }
})
</script>
