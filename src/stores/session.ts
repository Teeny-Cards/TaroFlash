import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'
import { getSession, login as supaLogin, logout as supaLogout } from '@/api/session'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'

export const useSessionStore = defineStore('sessionStore', () => {
  const router = useRouter()

  const user = ref<User | undefined>(undefined)
  const loadingCount = ref(0)

  const authenticated = computed(() => {
    return Boolean(user.value?.aud === 'authenticated')
  })

  const isLoading = computed(() => loadingCount.value > 0)
  const user_id = computed(() => user.value?.id)
  const user_email = computed(() => user.value?.email)

  async function login(email: string, password: string): Promise<void> {
    const session = await supaLogin(email, password)
    user.value = session?.user
  }

  async function restoreSession(): Promise<void> {
    const session = await getSession()
    user.value = session?.user
  }

  async function logout(): Promise<void> {
    await supaLogout()
    user.value = undefined
    router.push({ name: 'welcome' })
  }

  function startLoading(): void {
    loadingCount.value++
  }

  function stopLoading(): void {
    loadingCount.value--
  }

  return {
    user,
    authenticated,
    isLoading,
    user_id,
    user_email,
    login,
    restoreSession,
    logout,
    startLoading,
    stopLoading
  }
})
