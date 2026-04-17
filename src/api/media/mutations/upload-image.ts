import { useMutation } from '@pinia/colada'
import { uploadImage } from '../db'

type UploadImageVars = {
  bucket: string
  path: string
  file: File
}

export function useUploadImageMutation() {
  return useMutation({
    mutation: (vars: UploadImageVars) => uploadImage(vars.bucket, vars.path, vars.file)
  })
}
