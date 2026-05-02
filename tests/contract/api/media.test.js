import { describe, test, expect, beforeEach, afterEach } from 'vite-plus/test'
import { signInAsTestUser } from '../setup.js'
import { createDeck, insertCardDirect, makeImageFile } from '../fixtures.js'
import { uploadImage, deleteImage, getImageUrl, insertMedia, deleteMedia } from '@/api/media/db'

let session
let deck
let card

beforeEach(async () => {
  session = await signInAsTestUser()
  deck = await createDeck(session.client, session.userId)
  card = await insertCardDirect(session.client, deck.id)
})

afterEach(async () => {
  await session?.cleanup()
  session = null
  deck = null
  card = null
})

describe('uploadImage / deleteImage / getImageUrl (contract)', () => {
  test('uploads a file under the member folder, returns a public URL, then deletes it', async () => {
    const path = `${session.userId}/${card.id}/front/test.png`
    const url = await uploadImage('cards', path, makeImageFile())
    expect(url).toContain(path)

    expect(getImageUrl('cards', path)).toBe(url)

    await deleteImage('cards', path)
  })
})

describe('insertMedia / deleteMedia (contract)', () => {
  test('inserts a media row and soft-deletes via deleteMedia', async () => {
    const path = `${session.userId}/${card.id}/front/im.png`
    await uploadImage('cards', path, makeImageFile())

    await insertMedia({ bucket: 'cards', path, card_id: card.id, slot: 'card_front' })

    const { data: rows } = await session.client
      .from('media')
      .select('*')
      .eq('card_id', card.id)
      .is('deleted_at', null)
    expect(rows).toHaveLength(1)
    const inserted = rows[0]

    await deleteMedia(inserted.id)

    const { data: after } = await session.client
      .from('media')
      .select('deleted_at')
      .eq('id', inserted.id)
      .single()
    expect(after.deleted_at).not.toBeNull()

    await deleteImage('cards', path)
  })

  test('rejects when neither card_id nor deck_id is provided', async () => {
    await expect(
      insertMedia({ bucket: 'cards', path: 'x/y.png', slot: 'card_front' })
    ).rejects.toThrow(/card_id or deck_id/)
  })
})
