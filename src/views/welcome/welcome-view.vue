<script setup lang="ts">
import router from '@/router'
import { initUser } from '@/stores/initUser'
import { useSessionStore } from '@/stores/session'
import { useToast } from '@/composables/toast'
import { onMounted, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import Splash from './splash.vue'
import UiImage from '@/components/ui-kit/image.vue'
import AppFooter from '@/components/app-footer.vue'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const session = useSessionStore()
const toast = useToast()
const route = useRoute()

const splash = useTemplateRef('splash')

onMounted(async () => {
  if (route.query.payment === 'true') {
    splash.value?.openSignup(true)
    return
  }

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
  <splash ref="splash" @login="loginWithEmail" />
  <section class="w-full py-54.5 flex flex-col gap-80">
    <div class="flex gap-21 justify-center items-center">
      <div class="flex flex-col gap-3 w-152 text-brown-700 dark:text-brown-100">
        <h2 class="text-6xl">
          {{ t('welcome-view.build-decks') }}
        </h2>
        <p class="text-lg">
          {{ t('welcome-view.build-decks-desc') }}
        </p>
      </div>
      <ui-image src="deck-example" class="w-100" />
    </div>

    <div class="flex flex-col gap-6 justify-center items-center">
      <div class="flex flex-col gap-3 w-152 items-center text-brown-700 dark:text-brown-100">
        <h2 class="text-6xl">{{ t('welcome-view.study-decks') }}</h2>
        <p class="text-lg text-center">{{ t('welcome-view.study-decks-desc') }}</p>
      </div>
      <ui-image src="study-example" class="w-200" />
    </div>
  </section>

  <section
    class="w-full bg-brown-300 dark:bg-grey-800 bgx-bank-note dark:bgx-color-brown-800
      dark:bgx-color-brown-300 py-54.5 flex flex-col wave-top-[30px]"
  >
    <div class="flex gap-21 justify-center items-center">
      <ui-image src="phone-example" class="w-60 z-1" />
      <div class="flex flex-col gap-3 w-152 text-brown-700 dark:text-brown-100">
        <h2 class="text-6xl">{{ t('welcome-view.design') }}</h2>
        <p class="text-lg">{{ t('welcome-view.design-desc') }}</p>
      </div>
    </div>
  </section>

  <app-footer />
</template>
