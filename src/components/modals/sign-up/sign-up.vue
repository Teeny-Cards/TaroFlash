<script setup lang="ts">
import UiButton from '@/components/ui-kit/button.vue'
import SignupForm from './form.vue'
import { useI18n } from 'vue-i18n'
import { useTemplateRef, ref } from 'vue'
import { useRouter } from 'vue-router'
import UiLoader from '@/components/ui-kit/loader.vue'
import { useAlert } from '@/composables/alert'

const { close } = defineProps<{
  close: (response?: boolean, opts?: any) => void
}>()

const { t } = useI18n()
const router = useRouter()
const alert = useAlert()

const form = useTemplateRef('form')
const success = ref(false)

async function onSubmit() {
  success.value = (await form.value?.submit()) ?? false
}

function onLoadFinish() {
  if (success.value) {
    router.push('/dashboard')
  } else {
    alert.warn({
      title: t('signup-dialog.alert.generic-title'),
      message: t('signup-dialog.alert.generic-message'),
      cancelLabel: t('common.close')
    })
  }

  close(true, { silent: true })
}
</script>

<template>
  <div
    data-testid="signup-container"
    class="bg-brown-300 dark:bg-grey-800 rounded-10 shadow-lg overflow-hidden"
  >
    <ui-loader :loading="form?.loading" theme="blue" loading-image="logo" @finish="onLoadFinish">
      <div
        data-testid="signup__header"
        class="px-8 py-10 bg-blue-500 dark:bg-blue-650 bgx-leaf bgx-fill-brown-100
          dark:bgx-fill-brown-300 bgx-opacity-10 bgx-size-25 bg-size-[10%] wave-bottom-[30px] flex
          items-center justify-center"
      >
        <h1 class="text-5xl text-brown-100">{{ t('signup-dialog.header') }}</h1>
      </div>

      <div data-testid="signup__body" class="flex flex-col gap-8 py-8 px-15 items-center relative">
        <signup-form ref="form" />

        <div data-testid="actions" class="w-full flex justify-center gap-2.5 col-start-2">
          <ui-button size="lg" theme="brown" @click="close()">{{ t('common.cancel') }}</ui-button>
          <ui-button size="lg" fancy-hover @click="onSubmit">{{
            t('signup-dialog.cta')
          }}</ui-button>
        </div>
      </div>
    </ui-loader>
  </div>
</template>

<style>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s ease;
}

.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
