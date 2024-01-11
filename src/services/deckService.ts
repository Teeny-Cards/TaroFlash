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
  DocumentReference,
  doc,
  getDoc,
  deleteDoc,
  runTransaction
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
      const deck = { title, description, count, isPublic, id: doc.id }
      newDecks.push(deck)
    })

    decks.setDecks(newDecks)
  } catch (e) {
    console.log(e)
  }
}

const getDeckById = async (id: string): Promise<Deck | undefined> => {
  const db = getFirestore()
  const deckRef = doc(db, 'Decks', id)

  try {
    const docSnapshot = await getDoc(deckRef)

    if (docSnapshot.exists()) {
      const { title, description, id, isPublic, count } = docSnapshot.data()
      const deck = { title, description, id, isPublic, count }
      return deck
    }
  } catch (e) {
    console.log(e)
  }

  return undefined
}

const updateDeckById = async (id: string, newDeck: Deck): Promise<void> => {
  const db = getFirestore()
  const deckRef = doc(db, 'Decks', id)

  try {
    await runTransaction(db, async (transaction) => {
      const deck = await transaction.get(deckRef)

      if (!deck.exists()) {
        throw 'Document does not exist!'
      }

      transaction.update(deckRef, newDeck)
    })
  } catch (e) {
    //TODO: Handle Error
    console.log('Transaction failed: ', e)
  }
}

const deleteDeckById = async (id: string): Promise<void> => {
  const db = getFirestore()
  const deckRef = doc(db, 'Decks', id)

  try {
    await deleteDoc(deckRef)
  } catch (e) {
    //TODO: Throw error state to component
    console.log(e)
  }
}

export { createDeck, getUserDecks, getDeckById, deleteDeckById, updateDeckById }
