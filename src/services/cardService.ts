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

const saveCardsToDeck = async (deckID: string, cards: Card[]): Promise<void> => {
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
  await batch.commit()
}

const getCardsByDeckID = async (deckID: string): Promise<Card[]> => {
  const db = getFirestore()
  const q = query(collection(db, 'cards'), where('deckID', '==', deckID), orderBy('order'))

  const querySnapshot = await getDocs(q)
  const cards: Card[] = []

  querySnapshot.forEach((doc) => {
    cards.push({
      ...(doc.data() as Card),
      id: doc.id
    })
  })

  return cards
}

const updateCardsByDeckID = async (deckID: string, cards: CardMutation[]): Promise<void> => {
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

  await batch.commit()
}

const deleteCardsByDeckID = async (deckID: string): Promise<void> => {
  const db = getFirestore()
  const q = query(collection(db, 'cards'), where('deckID', '==', deckID))

  const querySnapshot = await getDocs(q)
  const batch = writeBatch(db)

  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref)
  })

  // TODO: Error Handling
  await batch.commit()
}

export { saveCardsToDeck, updateCardsByDeckID, getCardsByDeckID, deleteCardsByDeckID }
