import { supabase } from '@/supabase-client'
import type { Session } from '@supabase/supabase-js'

export type SignupEmailOptions = {
  display_name?: string
}

export type SignupOAuthOptions = {
  redirectTo?: string
  skipBrowserRedirect?: boolean
}

export type OAuthProvider = 'google'

const AUTH_REDIRECT_URL =
  import.meta.env.DEV && typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? `http://${window.location.hostname}:5173/auth/callback`
    : import.meta.env.VITE_AUTH_REDIRECT_URL

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw new Error(error.message)
  }

  return data?.session
}

export async function login(email: string, password: string): Promise<Session | null> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    throw new Error(error.message)
  }

  return data?.session
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}

export async function signupEmail(
  email: string,
  password: string,
  opts?: SignupEmailOptions
): Promise<Session | null> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: opts
    }
  })

  if (error) {
    throw error
  }

  return data?.session
}

export async function signInOAuth(
  provider: OAuthProvider,
  options?: SignupOAuthOptions
): Promise<void> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      skipBrowserRedirect: true,
      redirectTo: AUTH_REDIRECT_URL,
      ...options
    }
  })

  if (error || !data?.url) {
    throw error ?? new Error('No URL returned')
  }

  // Calculate centered position
  const width = 500
  const height = 600
  const left = window.screenX + (window.outerWidth - width) / 2
  const top = window.screenY + (window.outerHeight - height) / 2

  const popupFeatures = `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`

  // Check if window.open is supported and not blocked
  const popup = window.open(data.url, 'googleAuth', popupFeatures)

  if (!popup || popup.closed || typeof popup.closed === 'undefined') {
    // Fallback: redirect the current tab instead
    window.location.href = data.url
    return
  }

  return new Promise((resolve, reject) => {
    window.addEventListener(
      'message',
      async (event) => {
        if (event.origin !== window.location.origin) reject(new Error('Invalid origin'))
        if (event.data !== 'auth_complete') reject(new Error('Invalid message'))

        resolve()
      },
      { once: true }
    )
  })
}
