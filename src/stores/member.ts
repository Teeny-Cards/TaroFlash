import { fetchMemberById } from '@/api/members'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useMemberStore = defineStore('member', () => {
  const member = ref<Member | null>(null)

  async function fetchMember(user_id: string): Promise<void> {
    member.value = await fetchMemberById(user_id)
  }

  const has_member = computed(() => Boolean(member.value))
  const id = computed(() => member.value?.id ?? '')
  const display_name = computed(() => member.value?.display_name ?? '')
  const created_at = computed(() => member.value?.created_at ?? '')
  const description = computed(() => member.value?.description ?? '')
  const user_id = computed(() => member.value?.id ?? '')

  return {
    member,
    fetchMember,
    has_member,
    id,
    display_name,
    created_at,
    description,
    user_id
  }
})
