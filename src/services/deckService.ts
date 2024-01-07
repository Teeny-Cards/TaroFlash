import { useUserStore } from '../stores/user'
import { useDeckStore } from '../stores/decks'
import {
  addDoc,
  getDocs,
  query,
  where,
  collection,
  getFirestore,
  serverTimestamp,
  DocumentReference
} from 'firebase/firestore'

const createDeck = async (
  title: string,
  description: string,
  count: number,
  isPublic = false
): Promise<DocumentReference> => {
  const db = getFirestore()
  const user = useUserStore()

  const newDeck = {
    userID: user.id,
    title,
    description,
    count,
    isPublic: isPublic,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  }

  const deckRef = collection(db, 'Decks')

  return await addDoc(deckRef, newDeck)
}

const getUserDecks = async (): Promise<void> => {
  const user = useUserStore()
  const decks = useDeckStore()

  const db = getFirestore()
  const q = query(collection(db, 'Decks'), where('userID', '==', user.id))

  try {
    const querySnapshot = await getDocs(q)
    const newDecks: Deck[] = []

    querySnapshot.forEach((doc) => {
      const { title, description, count, isPublic } = doc.data()
      const deck = { title, description, count, isPublic }
      newDecks.push(deck)
    })

    decks.setDecks(newDecks)
  } catch (e) {
    console.log(e)
  }
}

export { createDeck, getUserDecks }
