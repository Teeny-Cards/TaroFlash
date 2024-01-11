<template>
  <section class="w-full h-screen flex items-center justify-center">Loading...</section>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useAppStore } from '@/stores/app'
import router from '@/router'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

const route = useRoute()
const path = route.query.path as string

const appStore = useAppStore()
const { loading } = storeToRefs(appStore)

watch(loading, (isLoading) => {
  if (!isLoading) {
    router.replace(path ?? '/dashboard')
  }
})
</script>
