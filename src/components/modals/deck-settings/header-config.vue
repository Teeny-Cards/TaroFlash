<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section
    data-testid="deck-settings__header"
    class="scallop-bottom flex h-30 w-full items-center justify-center bg-green-400 bgx-wave"
  >
    <h1 class="text-5xl font-semibold text-white">{{ t('deck.settings-modal.title') }}</h1>
  </section>
</template>
