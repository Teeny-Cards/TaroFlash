import {
  writeBatch,
  doc,
  where,
  query,
  getFirestore,
  serverTimestamp,
  collection,
  getDocs
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

  await batch.commit()
}

const getCardsByDeckID = async (deckID: string): Promise<Card[]> => {
  const db = getFirestore()
  const q = query(collection(db, 'cards'), where('deckID', '==', deckID))

  const querySnapshot = await getDocs(q)
  const cards: Card[] = []

  querySnapshot.forEach((doc) => {
    cards.push(doc.data() as Card)
  })

  return cards
}

export { saveCardsToDeck, getCardsByDeckID }
