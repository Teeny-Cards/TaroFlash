<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

export type AlertType = 'warn' | 'info'

const { cancelLabel, confirmLabel } = defineProps<{
  cancelLabel?: string
  confirmLabel?: string
  message?: string
  title?: string
  type?: AlertType
  close: (result?: boolean) => void
}>()

const { t } = useI18n()

const cancelText = computed(() => {
  return cancelLabel ?? t('common.cancel')
})

const confirmText = computed(() => {
  return confirmLabel ?? t('common.continue')
})

const buttonClasses = 'group relative w-full cursor-pointer p-4 text-lg text-brown-700'

const buttonHoverClasses = `
  rounded-2 absolute -inset-1 flex
  opacity-0 transition-[all] duration-100 ease-in-out
  group-hover:opacity-100 group-focus:opacity-100 focus:outline-none
  flex items-center justify-center p-0.75 bg-size-[400%_400%]
  `

const spanClasses = `bg-white w-full h-full rounded-1.5 flex items-center justify-center`

const borderColor: { [key in AlertType]: string } = {
  warn: 'bg-linear-to-br from-red-600 from-30% via-red-300 via-50% to-red-600 to-70%',
  info: 'bg-linear-to-br from-blue-500 from-40% via-blue-400 via-50% to-blue-500 to-80%'
}

const textColor: { [key in AlertType]: string } = {
  warn: 'text-red-500',
  info: 'text-blue-500'
}
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
        {{ cancelText }}
        <div :class="buttonHoverClasses" class="bg-grey-300 text-grey-500 animate-bg-slide">
          <span :class="spanClasses">
            {{ cancelText }}
          </span>
        </div>
      </button>
      <button
        data-testid="confirmation-alert__confirm"
        :class="buttonClasses"
        @click="() => close(true)"
      >
        {{ confirmText }}
        <div
          :class="[buttonHoverClasses, borderColor[type ?? 'warn'], textColor[type ?? 'warn']]"
          class="animate-bg-slide"
        >
          <span :class="spanClasses">
            {{ confirmText }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>
