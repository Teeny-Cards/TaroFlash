<template>
  <section class="w-full h-screen flex items-center justify-center">Loading...</section>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useMemberStore } from '@/stores/member'
import router from '@/router'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

const route = useRoute()
const path = route.query.path as string

const userStore = useMemberStore()
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
