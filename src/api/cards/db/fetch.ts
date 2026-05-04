import { supabase } from '@/supabase-client'
import { useMemberStore } from '@/stores/member'
import { isoNow } from '@/utils/date'

import logger from '@/utils/logger'

type FetchMemberCardCountOptions = {
  only_due_cards?: boolean
}

export async function fetchMemberCardCount(opts: FetchMemberCardCountOptions): Promise<number> {
  const { data, error } = await supabase.rpc('get_member_card_count', {
    p_member_id: useMemberStore().id,
    p_now: isoNow(),
    p_only_due_cards: opts.only_due_cards
  })

  if (error) {
    logger.error(error.message)
    throw new Error(error.message)
  }

  return data
}
