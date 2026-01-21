<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="p-4 text-brown-700 dark:text-brown-100">
    <h1 class="text-5xl font-bold mb-4">{{ t('terms-of-service.title') }}</h1>
    <p class="text-lg mb-8">{{ t('terms-of-service.description') }}</p>
  </div>
</template>
