import { fetchMemberById } from '@/services/memberService'
import { defineStore } from 'pinia'
import { useSessionStore } from './session'
import Logger from '@/utils/logger'

export const useMemberStore = defineStore('member', {
  state: () => ({
    display_name: '',
    id: '',
    description: '',
    created_at: '',
    num_decks: 0
  }),

  actions: {
    async fetchMember(): Promise<void> {
      const session = useSessionStore()

      try {
        const member = await fetchMemberById(session.user?.id ?? '')
        this.setMember(member)
      } catch (error: any) {
        Logger.error(`Error fetching member: ${error.message}`)
        throw error
      }
    },

    setMember(member: Member | null): void {
      if (!member) {
        Logger.warn('Attempted to set null member')
        return
      }

      Logger.debug(`Setting member data for: ${member.display_name}`)
      this.id = member.id ?? ''
      this.display_name = member.display_name ?? ''
      this.description = member.description ?? ''
      this.created_at = member.created_at ?? ''
      this.num_decks = member.num_decks ?? 0
    }
  }
})
