<template>
  <RouterView />
  <TeenyToastManager />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TeenyToastManager from '@/components/TeenyToastManager.vue'
</script>
