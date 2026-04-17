import { describe, test, expect, vi, beforeEach } from 'vite-plus/test'

const { useMutationSpy, uploadImageMock } = vi.hoisted(() => ({
  useMutationSpy: vi.fn((cfg) => cfg),
  uploadImageMock: vi.fn().mockResolvedValue('https://cdn/x')
}))

vi.mock('@pinia/colada', () => ({ useMutation: useMutationSpy }))

vi.mock('@/api/media/db', () => ({ uploadImage: uploadImageMock }))

import { useUploadImageMutation } from '@/api/media/mutations/upload-image'

beforeEach(() => {
  useMutationSpy.mockClear()
  uploadImageMock.mockClear()
  uploadImageMock.mockResolvedValue('https://cdn/x')
})

function configFrom() {
  useUploadImageMutation()
  return useMutationSpy.mock.calls.at(-1)[0]
}

describe('useUploadImageMutation', () => {
  test('mutation delegates to uploadImage with bucket, path, file', async () => {
    const { mutation } = configFrom()
    const file = new File(['x'], 'a.png', { type: 'image/png' })

    await mutation({ bucket: 'decks', path: 'user/cover', file })

    expect(uploadImageMock).toHaveBeenCalledWith('decks', 'user/cover', file)
  })

  test('mutation resolves with the URL returned by uploadImage (callers persist it elsewhere)', async () => {
    uploadImageMock.mockResolvedValueOnce('https://cdn/final.png')
    const { mutation } = configFrom()
    const file = new File(['x'], 'a.png', { type: 'image/png' })

    const url = await mutation({ bucket: 'decks', path: 'p', file })

    expect(url).toBe('https://cdn/final.png')
  })

  test('no onSettled is wired — uploads have no downstream cache to invalidate (URL is stored on the owning entity)', () => {
    const cfg = configFrom()
    expect(cfg.onSettled).toBeUndefined()
  })
})
