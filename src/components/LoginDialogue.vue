<template>
  <div class="p-4 border border-gray-400 rounded-12">
    <div class="flex flex-col gap-8 w-96 p-8 items-center">
      <h1 class="text-2xl font-bold">{{ signText }}</h1>
      <input
        type="email"
        placeholder="Email"
        autocomplete="email"
        v-model="email"
        class="border-b border-gray-400 focus:outline-hidden px-2 py-1 w-full bg-transparent"
      />
      <input
        type="password"
        placeholder="Password"
        :autocomplete="props.signIn ? 'current-password' : 'new-password'"
        v-model="password"
        class="border-b border-gray-400 focus:outline-hidden px-2 py-1 w-full bg-transparent"
      />
      <button class="bg-cyan-400 w-full rounded-12 p-3 text-white" @click="onClick">
        {{ signText }}
      </button>
      <span v-if="props.signIn"
        >Don't have an account?
        <RouterLink to="/signup" class="text-cyan-400 cursor-pointer"
          >Sign up here</RouterLink
        ></span
      >
      <span v-else
        >Already have an account?
        <RouterLink to="/signin" class="text-cyan-400 cursor-pointer"
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
