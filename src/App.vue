<template>
  <RouterView />
  <TeenyToastManager />
  <TeenyAlertManager />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TeenyToastManager from '@teeny/TeenyToastManager.vue'
import TeenyAlertManager from '@teeny/TeenyAlertManager.vue'
</script>
