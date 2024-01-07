import { useUserStore } from '../stores/user'
import { useDeckStore } from '../stores/decks'
import {
  addDoc,
  getDocs,
  query,
  where,
  collection,
  getFirestore,
  serverTimestamp
} from 'firebase/firestore'

const createDeck = async (title: string, description: string, isPublic = false): Promise<void> => {
  const db = getFirestore()
  const user = useUserStore()

  const newDeck = {
    userID: user.id,
    title: title,
    description: description,
    isPublic: isPublic,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  }

  const deckRef = collection(db, 'Decks')

  try {
    await addDoc(deckRef, newDeck)
  } catch (e) {
    console.log(e)
  }
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
      const { title, description, isPublic } = doc.data()
      const deck = { title, description, isPublic }
      newDecks.push(deck)
    })

    decks.setDecks(newDecks)
  } catch (e) {
    console.log(e)
  }
}

export { createDeck, getUserDecks }
