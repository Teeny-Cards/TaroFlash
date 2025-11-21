<script setup lang="ts">
import { ref } from 'vue'
import UiInput from '@/components/ui-kit/input.vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'submit', email: string, password: string): void
}>()

const { t } = useI18n()

const email = ref('')
const password = ref('')

function onSubmit(): void {
  emit('submit', email.value, password.value)
}
</script>

<template>
  <form class="flex flex-col items-center gap-10" @submit.prevent="onSubmit">
    <div class="flex flex-col gap-4 w-full">
      <ui-input
        type="email"
        name="email"
        autocomplete="username"
        v-model="email"
        :label="t('login-dialog.email')"
      />

      <ui-input
        type="password"
        name="password"
        autocomplete="current-password"
        v-model="password"
        :label="t('login-dialog.password')"
      />
    </div>

    <button
      type="submit"
      class="w-full px-4 py-2.5 rounded-2.5 bg-purple-500 text-lg text-brown-100 cursor-pointer"
    >
      {{ t('login-dialog.lets-go') }}
    </button>
  </form>
</template>
