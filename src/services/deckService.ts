import { useUserStore } from '@/stores/user'
import { uploadDeckPhoto } from '@/services/fileService'
import { TeenyError } from '@/utils/TeenyError'
import { deleteCardsByDeckID } from '@/services/cardService'
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

const createDeck = async (deck: Deck): Promise<DocumentReference> => {
  const db = getFirestore()
  const user = useUserStore()

  try {
    const { url, name } = await uploadDeckPhoto(deck.image)
    const { id, image, ...deckData } = deck

    const newDeck = {
      ...deckData,
      image: { url, name },
      userID: user.id,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    }

    const deckRef = collection(db, 'Decks')
    return await addDoc(deckRef, newDeck)
  } catch (e) {
    throw TeenyError.fromError(e)
  }
}

const getUserDecks = async (): Promise<Deck[]> => {
  const user = useUserStore()

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

    return newDecks
  } catch (e) {
    throw TeenyError.fromError(e)
  }
}

const getDeckById = async (id: string): Promise<Deck> => {
  const db = getFirestore()
  const deckRef = doc(db, 'Decks', id)

  try {
    const docSnapshot = await getDoc(deckRef)

    if (docSnapshot.exists()) {
      const { title, description, id, isPublic, count, image } = docSnapshot.data()
      const deck = { title, description, id, isPublic, count, image }

      return deck
    }

    throw new TeenyError('We had some trouble finding your deck', {
      name: 'ObjectNotFoundError'
    })
  } catch (e) {
    throw TeenyError.fromError(e)
  }
}

const updateDeckById = async (id: string, deck: Deck): Promise<void> => {
  const db = getFirestore()
  const deckRef = doc(db, 'Decks', id)

  try {
    const imageResponse = await uploadDeckPhoto(deck.image)

    await runTransaction(db, async (transaction) => {
      const deck = await transaction.get(deckRef)

      if (!deck.exists()) {
        const error = new TeenyError('We had some trouble finding your deck. Please try again.', {
          name: 'ObjectNotFoundError'
        })

        return { success: false, error }
      }

      const { imageFile, ...deckData } = deck.data()
      const { url, name } = imageResponse
      transaction.update(deckRef, {
        ...deckData,
        image: { url, name }
      })
    })
  } catch (e) {
    throw TeenyError.fromError(e)
  }
}

const deleteDeckById = async (id: string): Promise<void> => {
  const db = getFirestore()
  const deckRef = doc(db, 'Decks', id)

  try {
    await deleteCardsByDeckID(id)
    await deleteDoc(deckRef)
  } catch (e) {
    throw TeenyError.fromError(e)
  }
}

export { createDeck, getUserDecks, getDeckById, deleteDeckById, updateDeckById }
