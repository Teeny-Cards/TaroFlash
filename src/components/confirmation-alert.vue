<script lang="ts" setup>
defineProps<{ open: boolean; cancelLabel?: string; confirmLabel?: string }>()
defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <ui-kit:modal :open="open">
    <div class="bg-brown-300 rounded-5 shadow-modal flex flex-col gap-8 p-10">
      <div class="flex flex-col gap-2">
        <h1 class="text-grey-700 text-5xl">{{ $t('alert.delete-card') }}</h1>
        <p class="text-grey-700">{{ $t('alert.delete-card.message') }}</p>
      </div>
      <div class="flex w-full gap-2">
        <ui-kit:button variant="muted" icon-left="close" @click="$emit('cancel')">{{
          cancelLabel ?? $t('common.cancel')
        }}</ui-kit:button>
        <ui-kit:button variant="danger" icon-left="delete" @click="$emit('confirm')">{{
          confirmLabel ?? $t('common.delete')
        }}</ui-kit:button>
      </div>
    </div>
  </ui-kit:modal>
</template>
