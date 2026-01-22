<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import UiInput from '@/components/ui-kit/input.vue'
import UiButton from '@/components/ui-kit/button.vue'
import UiDivider from '@/components/ui-kit/divider.vue'
import { useSessionStore } from '@/stores/session'

const emit = defineEmits<{
  (e: 'submit', email: string, password: string): void
}>()

const { t } = useI18n()
const session = useSessionStore()

const email = ref('')
const password = ref('')

function submitOAuth(provider: 'google' | 'apple') {
  session.signInOAuth(provider)
}

function onSubmit(): void {
  emit('submit', email.value, password.value)
}
</script>

<template>
  <form class="flex flex-col items-center gap-6" @submit.prevent="onSubmit">
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
</template>
