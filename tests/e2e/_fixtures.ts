import { test as base } from '@playwright/test'
import { execSync } from 'node:child_process'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function loadEnv() {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      url: process.env.SUPABASE_URL,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
    }
  }
  const raw = execSync('supabase status -o env', { encoding: 'utf8' })
  const env = Object.fromEntries(
    raw
      .split('\n')
      .map((line) => line.match(/^(\w+)="?([^"]*)"?$/))
      .filter(Boolean)
      .map((m) => [m![1], m![2]])
  )
  return { url: env.API_URL, serviceRoleKey: env.SERVICE_ROLE_KEY }
}

function loadAnonKey() {
  if (process.env.SUPABASE_ANON_KEY) return process.env.SUPABASE_ANON_KEY
  const raw = execSync('supabase status -o env', { encoding: 'utf8' })
  const match = raw.match(/^ANON_KEY="?([^"\n]+)"?/m)
  if (!match) throw new Error('ANON_KEY not found in `supabase status -o env`')
  return match[1]
}

const { url: SUPABASE_URL, serviceRoleKey: SERVICE_ROLE_KEY } = loadEnv()
const SUPABASE_ANON_KEY = loadAnonKey()

const admin: SupabaseClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
})

export type SeededUser = {
  id: string
  email: string
  password: string
  client: SupabaseClient
}

export const test = base.extend<{ user: SeededUser }>({
  // eslint-disable-next-line no-empty-pattern -- Playwright fixture signature requires destructuring even when no other fixtures are used
  user: async ({}, use) => {
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const email = `e2e-${suffix}@taroflash.test`
    const password = 'e2e-password-12345'
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })
    if (error) throw error
    const id = data.user!.id

    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
    const { error: signInErr } = await client.auth.signInWithPassword({ email, password })
    if (signInErr) throw signInErr

    await client
      .from('members')
      .update({ display_name: `E2E ${id.slice(0, 6)}` })
      .eq('id', id)

    await use({ id, email, password, client })

    await admin.auth.admin.deleteUser(id).catch(() => {})
  }
})

export async function seedDeck(user: SeededUser, title: string) {
  // BEFORE INSERT trigger `set_member_id` overrides member_id with auth.uid(),
  // so seeding must happen through the user's signed-in client.
  const { data, error } = await user.client.from('decks').insert({ title }).select().single()
  if (error) throw error
  return data
}

export { expect } from '@playwright/test'
