<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/user'
import loadingIndicator from './components/loadingIndicator.vue'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { loading } = storeToRefs(userStore)
</script>
