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
        @click="() => close(false)"
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
      >
        {{ confirmText }}
        <div class="hover-effect">
          <span>{{ confirmText }}</span>
        </div>
      </button>
    </div>
  </div>
</template>
