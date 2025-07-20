<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

export type AlertType = 'warn' | 'info'

defineProps<{
  cancelLabel?: string
  confirmLabel?: string
  message?: string
  title?: string
  type?: AlertType
  close: (result?: boolean) => void
}>()

const { t } = useI18n()

const buttonClasses =
  'group relative w-full cursor-pointer p-4 text-lg hover:text-blue-500 text-brown-700'
const buttonHoverClasses = `
  rounded-2 absolute -inset-0.5 flex border-3 border-blue-500
  opacity-0 transition-[all] duration-100 ease-in-out
  group-hover:opacity-100 group-focus:opacity-100 focus:outline-none
  `
</script>

<template>
  <div
    data-testid="confirmation-alert"
    class="rounded-2 shadow-modal flex w-115 max-w-115 flex-col bg-white"
  >
    <div class="flex flex-col gap-2 p-10">
      <h1 class="text-brown-700 text-4xl">{{ title ?? t('alert.generic-title') }}</h1>
      <p class="text-brown-500">{{ message ?? t('alert.generic-message') }}</p>
    </div>

    <div class="border-brown-300 divide-brown-300 flex w-full divide-x border-t">
      <button
        data-testid="confirmation-alert__cancel"
        :class="buttonClasses"
        @click="() => close(false)"
      >
        {{ cancelLabel ?? t('common.cancel') }}
        <div :class="buttonHoverClasses" />
      </button>
      <button
        data-testid="confirmation-alert__confirm"
        :class="buttonClasses"
        @click="() => close(true)"
      >
        {{ confirmLabel ?? t('common.continue') }}
        <div :class="buttonHoverClasses" />
      </button>
    </div>
  </div>
</template>
