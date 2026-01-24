import { supabase } from '@/supabase-client'
import type { Session, User } from '@supabase/supabase-js'

export type SignupEmailOptions = {
  display_name?: string
}

export type SignupOAuthOptions = {
  redirectTo?: string
}

export type OAuthProvider = 'google'

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
  const { error } = await supabase.auth.signInWithOAuth({ provider, options })

  if (error) {
    throw error
  }
}
