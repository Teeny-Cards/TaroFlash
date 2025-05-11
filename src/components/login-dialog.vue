<template>
  <div class="rounded-12 border border-gray-400 p-4">
    <div class="flex w-96 flex-col items-center gap-8 p-8">
      <h1 class="text-2xl font-bold">{{ signText }}</h1>
      <input
        type="email"
        placeholder="Email"
        autocomplete="email"
        v-model="email"
        class="w-full border-b border-gray-400 bg-transparent px-2 py-1 focus:outline-hidden"
      />
      <input
        type="password"
        placeholder="Password"
        :autocomplete="props.signIn ? 'current-password' : 'new-password'"
        v-model="password"
        class="w-full border-b border-gray-400 bg-transparent px-2 py-1 focus:outline-hidden"
      />
      <ui-kit:button @click="onClick">
        {{ signText }}
      </ui-kit:button>
      <span v-if="props.signIn"
        >Don't have an account?
        <RouterLink to="/signup" class="cursor-pointer text-cyan-400"
          >Sign up here</RouterLink
        ></span
      >
      <span v-else
        >Already have an account?
        <RouterLink to="/signin" class="cursor-pointer text-cyan-400"
          >Sign in here</RouterLink
        ></span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  signIn: Boolean
})

const emit = defineEmits<{
  (e: 'signedIn', email: string, password: string): void
  (e: 'signedUp', email: string, password: string): void
}>()

const signText = computed(() => {
  return props.signIn ? 'Sign In' : 'Sign Up'
})
const email = ref('')
const password = ref('')

function onClick(): void {
  if (props.signIn) {
    emit('signedIn', email.value, password.value)
    return
  }

  emit('signedUp', email.value, password.value)
}
</script>
