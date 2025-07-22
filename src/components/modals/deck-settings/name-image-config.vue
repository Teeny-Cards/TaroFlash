<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Card from '@/components/card.vue'

const { t } = useI18n()

const title = defineModel<string>('title')
</script>

<template>
  <div class="relative flex flex-col items-center pb-6">
    <Card class="border-brown-100 border-6"></Card>
    <ui-kit:input
      :placeholder="t('deck.title-placeholder')"
      text-align="center"
      size="lg"
      class="absolute bottom-0"
      v-model:value="title"
    />
  </div>
</template>
