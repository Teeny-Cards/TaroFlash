<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{ cancelLabel?: string; confirmLabel?: string; close: (result?: boolean) => void }>()
defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div class="bg-brown-300 rounded-5 shadow-modal flex flex-col gap-8 p-10">
    <div class="flex flex-col gap-2">
      <h1 class="text-grey-700 text-5xl">{{ t('alert.delete-card') }}</h1>
      <p class="text-grey-700">{{ t('alert.delete-card.message') }}</p>
    </div>
    <div class="flex w-full gap-2">
      <ui-kit:button variant="muted" icon-left="close" @click="() => close(false)">{{
        cancelLabel ?? t('common.cancel')
      }}</ui-kit:button>
      <ui-kit:button variant="danger" icon-left="delete" @click="() => close(true)">{{
        confirmLabel ?? t('common.delete')
      }}</ui-kit:button>
    </div>
  </div>
</template>
