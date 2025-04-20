<template>
  <RouterView />

  <teleport to="[toast-container]">
    <ui-kit:toast v-for="(toast, index) in toasts" :key="index" :toast="toast" />
  </teleport>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)
</script>
