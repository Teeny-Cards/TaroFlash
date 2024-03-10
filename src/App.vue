<template>
  <RouterView />
  <TeenyToastManager />
  <TeenyAlertManager />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TeenyToastManager from '@/components/TeenyToastManager.vue'
import TeenyAlertManager from '@/components/TeenyAlertManager.vue'
</script>
