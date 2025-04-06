import { supabase } from '@/supabaseClient'
import type { Session } from '@supabase/supabase-js'
import Logger from '@/utils/logger'

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    Logger.error(`Error getting session: ${error.message}`)
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
    Logger.error(`Error logging in: ${error.message}`)
    throw new Error(error.message)
  }

  return data?.session
}
