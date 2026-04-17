import { useMutation } from '@pinia/colada'
import { createPortalSession, type CreatePortalSessionArgs } from '../db'

export function useCreatePortalSessionMutation() {
  return useMutation({
    mutation: (args: CreatePortalSessionArgs) => createPortalSession(args)
  })
}
