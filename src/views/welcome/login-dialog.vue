<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import UiInput from '@/components/ui-kit/input.vue'
import UiButton from '@/components/ui-kit/button.vue'
import UiDivider from '@/components/ui-kit/divider.vue'
import UiLoader from '@/components/ui-kit/loader.vue'
import { useSessionStore } from '@/stores/session'
import type { OAuthProvider } from '@/api/session'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/toast'

const router = useRouter()
const toast = useToast()

const { t } = useI18n()
const session = useSessionStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

function submitOAuth(provider: OAuthProvider) {
  session.signInOAuth(provider)
}

async function onSubmit(): Promise<void> {
  try {
    loading.value = true

    await session.login(email.value, password.value)
  } catch (e: any) {
    toast.error(e.message)
  } finally {
    loading.value = false
  }
}

async function onLoadFinish() {
  if (session.authenticated) {
    router.push({ name: 'authenticated' })
  }
}
</script>

<template>
  <div
    class="w-80 bg-brown-300 rounded-l-6 rounded-br-6 rounded-tr-0.5 p-6 shadow-sm overflow-hidden
      relative"
  >
    <ui-loader :loading="loading" theme="blue" loading-image="logo" @finish="onLoadFinish">
      <div class="flex flex-col items-center gap-6">
        <ui-button
          theme="brown"
          size="lg"
          class="w-full!"
          icon-left="google-logo"
          @click="submitOAuth('google')"
        >
          {{ t('signup-dialog.google') }}
        </ui-button>

        <ui-divider :label="t('common.or')" />

        <form class="w-full flex flex-col items-center gap-6" @submit.prevent="onSubmit">
          <div class="flex flex-col gap-4 w-full">
            <ui-input
              type="email"
              name="email"
              autocomplete="username"
              size="lg"
              v-model="email"
              :placeholder="t('login-dialog.email')"
            />

            <ui-input
              type="password"
              name="password"
              autocomplete="current-password"
              size="lg"
              v-model="password"
              :placeholder="t('login-dialog.password')"
            />
          </div>

          <ui-button size="lg" class="w-full!" @click="onSubmit">
            {{ t('login-dialog.lets-go') }}
          </ui-button>
        </form>
      </div>
    </ui-loader>
  </div>
</template>
