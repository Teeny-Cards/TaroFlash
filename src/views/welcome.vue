<script setup lang="ts">
import router from '@/router'
import { initUser } from '@/stores/initUser'
import { useSessionStore } from '@/stores/session'
import { useToast } from '@/composables/toast'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Splash from '@/components/views/welcome/splash.vue'

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
  <section class="w-full h-400 bg-brown-100 bg-(image:--taro-flash) bg-size-[50px]"></section>
</template>
