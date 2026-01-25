<script setup lang="ts">
import LoginDialogue from '@/views/welcome/login-dialog.vue'
import { useI18n } from 'vue-i18n'
import UiImage from '@/components/ui-kit/image.vue'
import UiPopover from '@/components/ui-kit/popover.vue'
import UiButton from '@/components/ui-kit/button.vue'
import { ref } from 'vue'
import { emitSfx } from '@/sfx/bus'
import SignupDialog from './sign-up/sign-up.vue'
import { useModal } from '@/composables/modal'

const { t } = useI18n()

const login_dropdown_open = ref(false)
const modal = useModal()

console.log('VITE_AUTH_PUBLIC_URL', import.meta.env.VITE_AUTH_PUBLIC_URL)

function openLoginDropdown() {
  login_dropdown_open.value = true
  emitSfx('ui.slide_up')
}

function closeLoginDropdown() {
  login_dropdown_open.value = false
  emitSfx('ui.card_drop')
}

function triggerLoginDropdown() {
  if (login_dropdown_open.value) {
    closeLoginDropdown()
  } else {
    openLoginDropdown()
  }
}

function openSignup(payment?: boolean) {
  modal.open(SignupDialog, {
    backdrop: true,
    openAudio: 'ui.double_pop_up',
    closeAudio: 'ui.double_pop_down',
    props: {
      payment
    }
  })
}

defineExpose({ openSignup })
</script>

<template>
  <section
    class="flex flex-col w-full p-7.5 relative bg-green-400 wave-bottom-[30px] bgx-diagonal-stripes
      bgx-size-20 bgx-opacity-12 bg-center"
  >
    <div class="absolute pointer-events-none inset-0 bg-(image:--bgx-stars) bg-center -z-1"></div>

    <div data-testid="welcome-view__top-bar" class="w-full flex justify-end">
      <ui-popover
        :open="login_dropdown_open"
        :gap="4"
        :use_arrow="false"
        position="bottom-end"
        @close="closeLoginDropdown"
      >
        <template #trigger>
          <button
            class="bg-brown-300 text-brown-700 px-4 py-2.5 rounded-2.5 text-lg cursor-pointer"
            :class="{ 'rounded-b-0.5': login_dropdown_open }"
            @click="triggerLoginDropdown"
          >
            {{ t('welcome-view.login') }}
          </button>
        </template>

        <LoginDialogue />
      </ui-popover>
    </div>

    <div
      data-testid="welcome-view__content-container"
      class="flex w-full justify-center items-center gap-16 py-64"
    >
      <div data-testid="welcome-view__content" class="flex flex-col items-center gap-7.5">
        <div class="flex flex-col items-center gap-1.5">
          <h1 class="text-8xl text-brown-100 font-bold">{{ t('app.title') }}</h1>
          <p class="text-brown-100 text-center text-lg w-60">{{ t('app.description') }}</p>
        </div>

        <ui-button size="lg" @click="openSignup" class="outline-4! outline-brown-100!">
          {{ t('welcome-view.sign-up') }}
        </ui-button>
      </div>

      <ui-image src="splash-logo" class="h-84 z-2" />
    </div>

    <div data-testid="stationary" class="absolute inset-0 pointer-events-none drop-shadow-sm">
      <ui-image src="splash-top-left" class="absolute top-0 left-0" />
      <ui-image src="splash-bottom-right" class="absolute bottom-0 right-0" />
    </div>
  </section>
</template>
