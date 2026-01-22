<script setup lang="ts">
import UiButton from '@/components/ui-kit/button.vue'
import PlanSelector from './plan-selector.vue'
import SignupForm from './form.vue'
import { useI18n } from 'vue-i18n'
import { ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

const { payment, close } = defineProps<{
  payment?: boolean
  close: (response?: boolean, opts?: any) => void
}>()

const { t } = useI18n()
const router = useRouter()

const form = useTemplateRef('form')

const selected_plan = ref<MemberType>('free')

function onPlanSelect(plan: MemberType) {
  selected_plan.value = plan
}

async function onSubmit() {
  try {
    const success = await form.value?.submit()
    if (!success) return

    router.push('/dashboard')
    close(true, { silent: true })
  } catch (e) {
    return // TODO: Show error message
  }
}
</script>

<template>
  <div
    data-testid="signup-container"
    class="bg-brown-300 dark:bg-grey-800 rounded-10 shadow-lg overflow-hidden"
  >
    <div
      data-testid="signup__header"
      class="px-8 py-10 bg-blue-500 dark:bg-blue-650 bgx-leaf bgx-fill-brown-100
        dark:bgx-fill-brown-300 bgx-opacity-10 bgx-size-25 bg-size-[10%] wave-bottom-[30px] flex
        items-center justify-center"
    >
      <h1 class="text-5xl text-brown-100">{{ t('signup-dialog.header') }}</h1>
    </div>

    <div
      data-testid="signup__body"
      class="grid grid-cols-[1fr_auto] gap-x-15 gap-y-8 py-8 px-15 items-center relative"
    >
      <plan-selector :selected_plan="selected_plan" @select="onPlanSelect" />
      <signup-form ref="form" :plan="selected_plan" />

      <div data-testid="actions" class="w-full flex justify-center gap-2.5 col-start-2">
        <ui-button size="lg" theme="brown">{{ t('common.cancel') }}</ui-button>
        <ui-button size="lg" @click="onSubmit">{{ t('signup-dialog.cta') }}</ui-button>
      </div>
    </div>
  </div>
</template>
