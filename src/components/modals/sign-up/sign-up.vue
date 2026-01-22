<script setup lang="ts">
import UiButton from '@/components/ui-kit/button.vue'
import PlanOption from './plan-option.vue'
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
      <div data-testid="signup__plan-selector" class="w-151.75 flex flex-col items-center">
        <h1 class="text-3xl text-brown-700 dark:text-brown-100">
          {{ t('signup-dialog.plan-header') }}
        </h1>
        <p class="text-brown-500 text-center">{{ t('signup-dialog.plan-desc') }}</p>

        <div class="w-full grid grid-cols-2 gap-3.5 pt-10.5">
          <plan-option
            :selected="selected_plan === 'free'"
            @select="selected_plan = 'free'"
            :name="t('signup-dialog.plan-free')"
            class="text-brown-500"
          >
            <template #header>
              <h2 class="text-4xl">Free</h2>
            </template>

            <p>Make up to 5 Decks</p>
            <p>Add up to 100 Cards per Deck</p>
            <p>Upload Images to Decks</p>
            <p>More Features to come!</p>
          </plan-option>

          <plan-option
            :selected="selected_plan === 'paid'"
            @select="selected_plan = 'paid'"
            theme="blue"
            :name="t('signup-dialog.plan-paid')"
            class="text-brown-100"
          >
            <template #header>
              <h2 class="text-4xl">$8/mo</h2>
            </template>

            <p>Make unlimited Decks</p>
            <p>Add unlimited Cards Per Deck</p>
            <p>Upload Images to Decks</p>
            <p>Upload Images to Cards</p>
            <p>More Features to come!</p>
            <p>Cancel anytime</p>
          </plan-option>
        </div>
      </div>

      <signup-form ref="form" :plan="selected_plan" />

      <div data-testid="actions" class="w-full flex justify-center gap-2.5 col-start-2">
        <ui-button size="lg" theme="brown">Cancel</ui-button>
        <ui-button size="lg" @click="onSubmit">Sign Up!</ui-button>
      </div>
    </div>
  </div>
</template>
