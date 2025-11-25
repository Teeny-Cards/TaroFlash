<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, onMounted } from 'vue'
import { useAudio } from '@/composables/audio'

export type AlertType = 'warn' | 'info'

const { cancelLabel, confirmLabel, close, cancelAudio, confirmAudio } = defineProps<{
  cancelLabel?: string
  confirmLabel?: string
  message?: string
  title?: string
  type?: AlertType
  cancelAudio?: string
  confirmAudio?: string
  close: (result?: boolean, args?: { overrideCloseAudio?: string }) => void
}>()

const { t } = useI18n()
const audio = useAudio()

const cancelText = computed(() => {
  return cancelLabel ?? t('common.cancel')
})

const confirmText = computed(() => {
  return confirmLabel ?? t('common.continue')
})

function onCancel() {
  console.log('cancel')
  close(false, { overrideCloseAudio: cancelAudio })
}

function onConfirm() {
  console.log('confirm')
  close(true, { overrideCloseAudio: confirmAudio })
}
</script>

<template>
  <div
    data-testid="ui-kit-alert-container"
    class="absolute inset-0 flex items-center justify-center"
  >
    <div
      data-testid="ui-kit-alert"
      class="rounded-2 shadow-modal flex w-115 max-w-115 flex-col bg-white"
      :class="`ui-kit-alert--${type ?? 'warn'}`"
      v-bind="$attrs"
    >
      <div data-testid="ui-kit-alert__body" class="flex flex-col gap-2 p-10">
        <h1 class="text-brown-700 text-4xl">{{ title ?? t('alert.generic-title') }}</h1>
        <p class="text-brown-500">{{ message ?? t('alert.generic-message') }}</p>
      </div>

      <div
        data-testid="ui-kit-alert__actions"
        class="border-brown-300 divide-brown-300 flex w-full divide-x border-t"
      >
        <button
          data-testid="ui-kit-alert__cancel"
          class="ui-kit-alert__cancel group"
          @click="onCancel"
          @mouseenter="audio.play('click_04')"
        >
          {{ cancelText }}
          <div class="hover-effect group-hover:opacity-100! group-focus:opacity-100!">
            <span>{{ cancelText }}</span>
          </div>
        </button>

        <button
          data-testid="ui-kit-alert__confirm"
          class="ui-kit-alert__confirm group"
          @click="onConfirm"
          @mouseenter="audio.play('click_04')"
        >
          {{ confirmText }}
          <div class="hover-effect group-hover:opacity-100! group-focus:opacity-100!">
            <span>{{ confirmText }}</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.ui-kit-alert__cancel,
.ui-kit-alert__confirm {
  position: relative;

  padding: 16px;
  width: 100%;

  color: var(--color-brown-700);
  font-size: var(--text-lg);
  line-height: var(--text-lg--line-height);

  cursor: pointer;
}

.hover-effect {
  position: absolute;
  inset: -4px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 3px;
  opacity: 0;
  background-size: 400% 400%;
  border-radius: var(--radius-2);

  transition: all 100ms ease-in-out;
  animation: background-slide 2s linear infinite;
  outline: none;
}

.ui-kit-alert__cancel .hover-effect {
  background-color: var(--color-grey-300);
  color: var(--color-grey-500);
}

.ui-kit-alert--warn .ui-kit-alert__confirm .hover-effect {
  color: var(--color-red-600);
  background-image: linear-gradient(
    to right bottom in oklab,
    var(--color-red-600) 30%,
    var(--color-red-300) 50%,
    var(--color-red-600) 70%
  );
}

.ui-kit-alert--info .ui-kit-alert__confirm .hover-effect {
  color: var(--color-blue-500);
  background-image: linear-gradient(
    to right bottom in oklab,
    var(--color-blue-500) 40%,
    var(--color-blue-400) 50%,
    var(--color-blue-500) 80%
  );
}

.hover-effect span {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;
  width: 100%;

  background-color: var(--color-white);
  border-radius: var(--radius-1_5);
}
</style>
