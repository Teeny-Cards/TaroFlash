<template>
  <RouterView />
  <ui-kit:toast-manager />
  <ui-kit:alert-manager />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
