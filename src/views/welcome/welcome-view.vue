<script setup lang="ts">
import router from '@/router'
import { initUser } from '@/stores/initUser'
import { useSessionStore } from '@/stores/session'
import { useToast } from '@/composables/toast'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Splash from './splash.vue'
import UiImage from '@/components/ui-kit/image.vue'

const { t } = useI18n()
const session = useSessionStore()
const toast = useToast()

onMounted(async () => {
  const authenticated = await initUser()

  if (authenticated) {
    router.push({ name: 'authenticated' })
  }
})

async function loginWithEmail(email: string, password: string): Promise<void> {
  try {
    await session.login(email, password)
    router.push({ name: 'authenticated' })
  } catch (e: any) {
    toast.error(e.message)
  }
}
</script>

<template>
  <splash @login="loginWithEmail" />
  <section class="w-full bg-brown-100 py-54.5 flex flex-col gap-62.75">
    <div class="flex gap-21 justify-center items-center">
      <div class="flex flex-col gap-3 w-152">
        <h2 class="text-brown-700 text-6xl">{{ t('welcome-view.build-decks') }}</h2>
        <p class="text-brown-700 text-lg">{{ t('welcome-view.build-decks-desc') }}</p>
      </div>
      <ui-image src="deck-example" class="w-100" />
    </div>

    <div class="flex flex-col gap-21 justify-center items-center">
      <div class="flex flex-col gap-3 w-152 items-center">
        <h2 class="text-brown-700 text-6xl">{{ t('welcome-view.study-decks') }}</h2>
        <p class="text-brown-700 text-lg text-center">{{ t('welcome-view.study-decks-desc') }}</p>
      </div>
      <ui-image src="study-example" class="w-200" />
    </div>
  </section>

  <section class="w-full bg-brown-300 bg-(image:--bank-note) py-54.5 flex flex-col wave-top-[30px]">
    <div class="flex gap-21 justify-center items-center">
      <ui-image src="phone-example" class="w-60" />
      <div class="flex flex-col gap-3 w-152">
        <h2 class="text-brown-700 text-6xl">{{ t('welcome-view.design') }}</h2>
        <p class="text-brown-700 text-lg">{{ t('welcome-view.design-desc') }}</p>
      </div>
    </div>
  </section>
</template>
