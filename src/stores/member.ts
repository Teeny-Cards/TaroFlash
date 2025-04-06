import { supabase } from '@/supabaseClient'
import { fetchMemberById } from '@/services/memberService'
import { defineStore } from 'pinia'
import { useSessionStore } from './session'

export const useMemberStore = defineStore('member', {
  state: () => ({
    display_name: '',
    id: '',
    description: '',
    created_at: '',
    num_decks: 0,
    authenticated: false
  }),

  actions: {
    async login(): Promise<void> {
      const session = useSessionStore()
      session.setLoading(true)
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw new Error(error.message)
      }

      const member = await fetchMemberById(data.session?.user.id ?? '')

      this.authenticated = data.session?.user.aud === 'authenticated'
      this.setMember(member)
      session.setLoading(false)
    },

    setMember(member: Member | null): void {
      if (!member) return

      this.id = member.id ?? ''
      this.display_name = member.display_name ?? ''
      this.description = member.description ?? ''
      this.created_at = member.created_at ?? ''
      this.num_decks = member.num_decks ?? 0
    }
  }
})
