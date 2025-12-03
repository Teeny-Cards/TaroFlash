<script setup lang="ts">
import LoginDialogue from '@/components/login-dialog.vue'
import { useI18n } from 'vue-i18n'
import { useAudio } from '@/composables/audio'
import UiImage from '@/components/ui-kit/image.vue'
import UiPopover from '@/components/ui-kit/popover.vue'
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'login', email: string, password: string): void
}>()

const { t } = useI18n()
const audio = useAudio()

const login_dropdown_open = ref(false)

function openLoginDropdown() {
  login_dropdown_open.value = true
  audio.play('slide_up')
}

function closeLoginDropdown() {
  login_dropdown_open.value = false
  audio.play('card_drop')
}

function triggerLoginDropdown() {
  if (login_dropdown_open.value) {
    closeLoginDropdown()
  } else {
    openLoginDropdown()
  }
}

const onLogin = (email: string, password: string) => {
  emit('login', email, password)
}
</script>

<template>
  <section
    class="flex flex-col w-full p-7.5 relative bg-green-400 wave-bottom-[30px] bg-(image:--diagonal-stripes)
      bg-size-(--bg-sm) bg-center"
  >
    <div class="absolute pointer-events-none inset-0 bg-(image:--stars) bg-center -z-1"></div>

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
            class="bg-brown-300 text-brown-900 px-4 py-2.5 rounded-2.5 text-lg cursor-pointer"
            :class="{ 'rounded-b-0.5': login_dropdown_open }"
            @click="triggerLoginDropdown"
          >
            {{ t('welcome-view.login') }}
          </button>
        </template>

        <div
          class="w-80 bg-brown-300 rounded-l-2.5 rounded-br-2.5 rounded-tr-0.5 p-6 shadow-cutout"
        >
          <LoginDialogue @submit="onLogin" />
        </div>
      </ui-popover>
    </div>

    <div class="flex w-full justify-center items-center gap-6 p-23">
      <div data-testid="welcome-view__content" class="flex flex-col items-center gap-7.5">
        <div class="flex flex-col gap-1.5">
          <h1 class="text-8xl text-brown-100 font-bold uppercase">{{ t('app.title') }}</h1>
          <p class="text-brown-100 text-center text-lg">{{ t('app.description') }}</p>
        </div>

        <button class="bg-blue-500 text-brown-100 px-4 py-2.5 rounded-2.5 text-lg cursor-pointer">
          {{ t('welcome-view.sign-up') }}
        </button>
      </div>

      <ui-image src="splash-logo" class="h-84" />
    </div>

    <div data-testid="stationary" class="absolute inset-0 pointer-events-none drop-shadow-cutout">
      <ui-image src="splash-top-left" class="absolute top-0 left-0" />
      <ui-image src="splash-bottom-right" class="absolute bottom-0 right-0" />
    </div>
  </section>
</template>
