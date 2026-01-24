import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'
import {
  getSession,
  login as supaLogin,
  logout as supaLogout,
  signupEmail as supaSignupEmail,
  signInOAuth as supaSignInOAuth,
  type SignupEmailOptions,
  type SignupOAuthOptions,
  type OAuthProvider
} from '@/api/session'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useMemberStore } from './member'
import { useLogger } from '@/composables/logger'

export const useSessionStore = defineStore('sessionStore', () => {
  const router = useRouter()
  const memberStore = useMemberStore()
  const logger = useLogger()

  const user = ref<User | undefined>(undefined)
  const loading_count = ref(0)

  const authenticated = computed(() => Boolean(user.value?.aud === 'authenticated'))
  const isLoading = computed(() => loading_count.value > 0)
  const user_id = computed(() => user.value?.id ?? '')

  async function restoreSession(): Promise<boolean> {
    startLoading()

    try {
      if (!authenticated.value) {
        const session = await getSession()
        user.value = session?.user
      }

      if (user_id.value && !memberStore.has_member) {
        await memberStore.fetchMember(user_id.value)
      }

      return authenticated.value
    } catch (e: any) {
      logger.error(`Error initializing user: ${e.message}`)
      return false
    } finally {
      stopLoading()
    }
  }

  async function login(email: string, password: string): Promise<void> {
    await supaLogin(email, password)
  }

  async function logout(): Promise<void> {
    await supaLogout()
    reset()
    router.push({ name: 'welcome' })
  }

  async function signupEmail(
    email: string,
    password: string,
    opts?: SignupEmailOptions
  ): Promise<void> {
    await supaSignupEmail(email, password, opts)
  }

  async function signInOAuth(provider: OAuthProvider, options?: SignupOAuthOptions): Promise<void> {
    await supaSignInOAuth(provider, options)
  }

  function reset() {
    user.value = undefined
  }

  function startLoading(): void {
    loading_count.value++
  }

  function stopLoading(): void {
    loading_count.value--
  }

  return {
    user,
    authenticated,
    isLoading,
    login,
    restoreSession,
    logout,
    signupEmail,
    signInOAuth,
    startLoading,
    stopLoading
  }
})
