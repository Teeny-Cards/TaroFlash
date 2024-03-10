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
  orderBy,
  deleteDoc
} from 'firebase/firestore'

const saveCardsToDeck = async (deckID: string, cards: CardMutation[]): Promise<void> => {
  const db = getFirestore()
  const batch = writeBatch(db)

  cards.forEach((card) => {
    const cardRef = doc(collection(db, 'cards'))

    const { deleted, id, dirty, ...cleanCard } = card
    const newCard = {
      ...cleanCard,
      deckID: deckID,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    }

    batch.set(cardRef, newCard)
  })

  try {
    await batch.commit()
  } catch (e) {
    throw TeenyError.fromError(e)
  }
}

const getCardsByDeckID = async (deckID: string): Promise<Card[]> => {
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

    return cards
  } catch (e) {
    throw TeenyError.fromError(e)
  }
}

const updateCardsByDeckID = async (deckID: string, cards: CardMutation[]): Promise<void> => {
  const db = getFirestore()
  const batch = writeBatch(db)

  cards.forEach((card) => {
    const { id, deleted, dirty, ...cleanCard } = card

    if (id) {
      const cardRef = doc(collection(db, 'cards'), id)

      if (deleted) {
        batch.delete(cardRef)
      } else {
        batch.update(cardRef, cleanCard)
      }
    } else {
      const cardRef = doc(collection(db, 'cards'))
      const newCard = {
        ...cleanCard,
        deckID,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      }

      batch.set(cardRef, newCard)
    }
  })

  try {
    await batch.commit()
  } catch (e) {
    throw TeenyError.fromError(e)
  }
}

const deleteCardsByDeckID = async (deckID: string): Promise<void> => {
  const db = getFirestore()
  const q = query(collection(db, 'cards'), where('deckID', '==', deckID))

  const querySnapshot = await getDocs(q)
  const batch = writeBatch(db)

  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref)
  })

  try {
    await batch.commit()
  } catch (e) {
    throw TeenyError.fromError(e)
  }
}

const deleteCardById = async (cardID: string): Promise<void> => {
  const db = getFirestore()
  const cardRef = doc(db, 'cards', cardID)

  try {
    await deleteDoc(cardRef)
  } catch (e) {
    throw TeenyError.fromError(e)
  }
}

export {
  saveCardsToDeck,
  updateCardsByDeckID,
  getCardsByDeckID,
  deleteCardsByDeckID,
  deleteCardById
}
