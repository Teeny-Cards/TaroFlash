import { TeenyError } from '@/utils/TeenyError'
import {
  writeBatch,
  doc,
  where,
  query,
  getFirestore,
  serverTimestamp,
  collection,
  getDocs,
  orderBy
} from 'firebase/firestore'

const saveCardsToDeck = async (deckID: string, cards: Card[]): TeenyResponse<void> => {
  const db = getFirestore()
  const batch = writeBatch(db)

  cards.forEach((card) => {
    const cardRef = doc(collection(db, 'cards'))
    const newCard = {
      ...card,
      deckID: deckID,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    }

    batch.set(cardRef, newCard)
  })

  // TODO: Error Handling
  try {
    await batch.commit()
    return { success: true, value: undefined }
  } catch (e) {
    return { success: false, error: TeenyError.fromError(e) }
  }
}

const getCardsByDeckID = async (deckID: string): TeenyResponse<Card[]> => {
  const db = getFirestore()
  const q = query(collection(db, 'cards'), where('deckID', '==', deckID), orderBy('order'))

  try {
    const querySnapshot = await getDocs(q)
    const cards: Card[] = []

    querySnapshot.forEach((doc) => {
      cards.push({
        ...(doc.data() as Card),
        id: doc.id
      })
    })

    return { success: true, value: cards }
  } catch (e) {
    return { success: false, error: TeenyError.fromError(e) }
  }
}

const updateCardsByDeckID = async (deckID: string, cards: CardMutation[]): TeenyResponse<void> => {
  const db = getFirestore()
  const batch = writeBatch(db)

  cards.forEach((card) => {
    const { id, deleted, ...cardWithoutId } = card

    if (id) {
      const cardRef = doc(collection(db, 'cards'), id)

      if (deleted) {
        batch.delete(cardRef)
      } else {
        batch.update(cardRef, cardWithoutId)
      }
    } else {
      const cardRef = doc(collection(db, 'cards'))
      const newCard = {
        ...cardWithoutId,
        deckID,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      }

      batch.set(cardRef, newCard)
    }
  })

  try {
    await batch.commit()
    return { success: true, value: undefined }
  } catch (e) {
    return { success: false, error: TeenyError.fromError(e) }
  }
}

const deleteCardsByDeckID = async (deckID: string): TeenyResponse<void> => {
  const db = getFirestore()
  const q = query(collection(db, 'cards'), where('deckID', '==', deckID))

  const querySnapshot = await getDocs(q)
  const batch = writeBatch(db)

  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref)
  })

  try {
    await batch.commit()
    return { success: true, value: undefined }
  } catch (e) {
    return { success: false, error: TeenyError.fromError(e) }
  }
}

export { saveCardsToDeck, updateCardsByDeckID, getCardsByDeckID, deleteCardsByDeckID }
