<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, onMounted } from 'vue'
import { useAudio } from '@/composables/use-audio'

export type AlertType = 'warn' | 'info'

const { cancelLabel, confirmLabel, close } = defineProps<{
  cancelLabel?: string
  confirmLabel?: string
  message?: string
  title?: string
  type?: AlertType
  close: (result?: boolean) => void
}>()

const { t } = useI18n()
const audio = useAudio()

onMounted(() => {
  audio.play('etc_woodblock_stuck')
})

const cancelText = computed(() => {
  return cancelLabel ?? t('common.cancel')
})

const confirmText = computed(() => {
  return confirmLabel ?? t('common.continue')
})

function onCancel() {
  audio.play('digi_powerdown')
  close(false)
}
</script>

<template>
  <div data-testid="ui-kit-alert" class="ui-kit-alert" :class="`ui-kit-alert--${type ?? 'warn'}`">
    <div data-testid="ui-kit-alert__body" class="ui-kit-alert__body">
      <h1>{{ title ?? t('alert.generic-title') }}</h1>
      <p>{{ message ?? t('alert.generic-message') }}</p>
    </div>

    <div data-testid="ui-kit-alert__actions" class="ui-kit-alert__actions">
      <button
        data-testid="ui-kit-alert__cancel"
        class="ui-kit-alert__cancel group"
        @click="onCancel"
        @mouseenter="audio.play('click_04')"
      >
        {{ cancelText }}
        <div class="hover-effect">
          <span>{{ cancelText }}</span>
        </div>
      </button>

      <button
        data-testid="ui-kit-alert__confirm"
        class="ui-kit-alert__confirm group"
        @click="() => close(true)"
        @mouseenter="audio.play('click_04')"
      >
        {{ confirmText }}
        <div class="hover-effect">
          <span>{{ confirmText }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<style>
@reference '@/styles/main.css';

.ui-kit-alert {
  @apply rounded-2 shadow-modal flex w-115 max-w-115 flex-col bg-white;
}

.ui-kit-alert__body {
  @apply flex flex-col gap-2 p-10;
}

.ui-kit-alert__body h1 {
  @apply text-brown-700 text-4xl;
}

.ui-kit-alert__body p {
  @apply text-brown-500;
}

.ui-kit-alert__actions {
  @apply border-brown-300 divide-brown-300 flex w-full divide-x border-t;
}

.ui-kit-alert__cancel,
.ui-kit-alert__confirm {
  @apply text-brown-700 relative w-full cursor-pointer p-4 text-lg;
}

.hover-effect {
  @apply animate-bg-slide rounded-2 absolute -inset-1 flex items-center justify-center bg-size-[400%_400%] p-0.75 opacity-0 transition-[all] duration-100 ease-in-out group-hover:opacity-100 group-focus:opacity-100 focus:outline-none;
}

.ui-kit-alert__cancel .hover-effect {
  @apply bg-grey-300 text-grey-500;
}

.ui-kit-alert--warn .ui-kit-alert__confirm .hover-effect {
  @apply bg-linear-to-br from-red-600 from-30% via-red-300 via-50% to-red-600 to-70% text-red-500;
}

.ui-kit-alert--info .ui-kit-alert__confirm .hover-effect {
  @apply bg-linear-to-br from-blue-500 from-40% via-blue-400 via-50% to-blue-500 to-80% text-blue-500;
}

.hover-effect span {
  @apply rounded-1.5 flex h-full w-full items-center justify-center bg-white;
}
</style>
