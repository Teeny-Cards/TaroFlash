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

export const useSessionStore = defineStore('sessionStore', () => {
  const router = useRouter()

  const user = ref<User | undefined>(undefined)
  const loading_count = ref(0)
  const has_setup = ref(false)

  const authenticated = computed(() => Boolean(user.value?.aud === 'authenticated'))
  const isLoading = computed(() => loading_count.value > 0)

  async function setup(): Promise<void> {
    if (has_setup.value) return

    startLoading()

    try {
      const session = await getSession()
      user.value = session?.user

      if (!user.value) {
        throw new Error('Not authenticated')
      }

      console.log(user.value)
      await useMemberStore().fetchMember(user.value.id)
      has_setup.value = true
    } catch (e: any) {
      user.value = undefined
    } finally {
      stopLoading()
    }
  }

  async function login(email: string, password: string): Promise<void> {
    await supaLogin(email, password)
    await setup()
  }

  async function logout(): Promise<void> {
    await supaLogout()
    user.value = undefined
    has_setup.value = false
    router.push({ name: 'welcome' })
  }

  async function signupEmail(
    email: string,
    password: string,
    opts?: SignupEmailOptions
  ): Promise<void> {
    await supaSignupEmail(email, password, opts)
    await setup()
  }

  async function signInOAuth(provider: OAuthProvider, options?: SignupOAuthOptions): Promise<void> {
    await supaSignInOAuth(provider, options)
    await setup()
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
    setup,
    logout,
    signupEmail,
    signInOAuth,
    startLoading,
    stopLoading
  }
})
