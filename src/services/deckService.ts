import { useUserStore } from '@/stores/user'
import { useDeckStore } from '@/stores/decks'
import { uploadDeckPhoto } from '@/services/fileService'
import { TeenyError } from '@/utils/TeenyError'
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

  try {
    return await addDoc(deckRef, newDeck)
  } catch (e) {
    throw new TeenyError(e)
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
      const { title, description, count, isPublic, image } = doc.data()
      const deck = { title, description, count, isPublic, image, id: doc.id }
      newDecks.push(deck)
    })

    decks.setDecks(newDecks)
  } catch (e) {
    throw new TeenyError(e)
  }
}

const getDeckById = async (id: string): Promise<Deck | undefined> => {
  const db = getFirestore()
  const deckRef = doc(db, 'Decks', id)

  try {
    const docSnapshot = await getDoc(deckRef)

    if (docSnapshot.exists()) {
      const { title, description, id, isPublic, count, image } = docSnapshot.data()
      const deck = { title, description, id, isPublic, count, image }
      return deck
    }
  } catch (e) {
    throw new TeenyError(e)
  }

  return undefined
}

const updateDeckById = async (id: string, deck: Deck): Promise<void> => {
  const db = getFirestore()
  const deckRef = doc(db, 'Decks', id)

  try {
    const image = await uploadDeckPhoto(deck.image)

    await runTransaction(db, async (transaction) => {
      const deck = await transaction.get(deckRef)

      if (!deck.exists()) {
        throw 'Document does not exist!'
      }

      const { imageFile, ...deckData } = deck.data()
      transaction.update(deckRef, { ...deckData, image })
    })
  } catch (e) {
    throw new TeenyError(e)
  }
}

const deleteDeckById = async (id: string): Promise<void> => {
  const db = getFirestore()
  const deckRef = doc(db, 'Decks', id)

  try {
    await deleteDoc(deckRef)
  } catch (e) {
    throw new TeenyError(e)
  }
}

export { createDeck, getUserDecks, getDeckById, deleteDeckById, updateDeckById }
