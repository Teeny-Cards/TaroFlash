import { computed, reactive, ref, type InjectionKey, type Ref } from 'vue'
import { useUpsertMemberMutation } from '@/api/members'
import { useMemberStore } from '@/stores/member'
import { MEMBER_CARD_PREVIEW_DEFAULTS } from '@/utils/member/defaults'
import { buildMemberPayload, hasMemberChanges } from '@/utils/member/payload'

/**
 * Reactive state + mutations for editing the current member's profile.
 * Owns the in-flight `settings` object that the settings tabs bind into,
 * plus the previewed theme for the floating member-card. Mirrors
 * `useDeckEditor` for the deck-settings modal.
 */
export function useMemberEditor() {
  const member_store = useMemberStore()

  const settings = reactive<{ display_name?: string; description?: string }>({
    display_name: member_store.display_name,
    description: member_store.description
  })

  const theme: Ref<Theme> = ref(MEMBER_CARD_PREVIEW_DEFAULTS.theme)

  const email = computed(() => member_store.email ?? '')
  const created_at = computed(() => member_store.created_at ?? '')
  const plan = computed(() => member_store.plan ?? 'free')

  const initial_payload = buildMemberPayload({ settings })
  const is_dirty = computed(() => hasMemberChanges({ settings }, initial_payload))

  const upsert_mutation = useUpsertMemberMutation()

  /** Persist staged changes via the members upsert mutation. No-op when nothing changed. */
  async function saveMember(): Promise<boolean> {
    if (!is_dirty.value) return false
    if (!member_store.id) return false

    try {
      await upsert_mutation.mutateAsync({
        id: member_store.id,
        ...buildMemberPayload({ settings })
      })
      return true
    } catch {
      return false
    }
  }

  return {
    settings,
    theme,
    email,
    created_at,
    plan,
    is_dirty,
    saving: upsert_mutation.isLoading,
    saveMember
  }
}

export type MemberEditor = ReturnType<typeof useMemberEditor>

/**
 * Inject key for the settings app's editor instance. The settings root
 * provides the `useMemberEditor()` result; tabs and the floating
 * member-card preview `inject(memberEditorKey)` to read/write without
 * prop drilling.
 */
export const memberEditorKey = Symbol('memberEditor') as InjectionKey<MemberEditor>
