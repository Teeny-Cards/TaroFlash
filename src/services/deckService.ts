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

const createDeck = async (deck: Deck): TeenyResponse<DocumentReference> => {
  const db = getFirestore()
  const user = useUserStore()
  const imageResponse = await uploadDeckPhoto(deck.image)

  if (!imageResponse.success) {
    return { success: false, error: imageResponse.error }
  }

  const { id, ...cleanDeck } = deck
  const { image, ...deckData } = cleanDeck
  const { url, name } = imageResponse.value
  const newDeck = {
    ...deckData,
    image: { url, name },
    userID: user.id,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  }

  const deckRef = collection(db, 'Decks')

  try {
    const doc = await addDoc(deckRef, newDeck)
    return { success: true, value: doc }
  } catch (e) {
    return { success: false, error: TeenyError.fromError(e) }
  }
}

const getUserDecks = async (): TeenyResponse<Deck[]> => {
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

    return { success: true, value: newDecks }
  } catch (e) {
    return { success: false, error: TeenyError.fromError(e) }
  }
}

const getDeckById = async (id: string): TeenyResponse<Deck> => {
  const db = getFirestore()
  const deckRef = doc(db, 'Decks', id)

  try {
    const docSnapshot = await getDoc(deckRef)

    if (docSnapshot.exists()) {
      const { title, description, id, isPublic, count, image } = docSnapshot.data()
      const deck = { title, description, id, isPublic, count, image }
      return { success: true, value: deck }
    }

    //TODO Provide a better error
    return {
      success: false,
      error: new TeenyError('We had some trouble finding your deck. Please try again.', {
        name: 'ObjectNotFoundError'
      })
    }
  } catch (e) {
    return { success: false, error: TeenyError.fromError(e) }
  }
}

const updateDeckById = async (id: string, deck: Deck): TeenyResponse<void> => {
  const db = getFirestore()
  const deckRef = doc(db, 'Decks', id)

  const imageResponse = await uploadDeckPhoto(deck.image)

  if (!imageResponse.success) {
    return { success: false, error: imageResponse.error }
  }

  try {
    await runTransaction(db, async (transaction) => {
      const deck = await transaction.get(deckRef)

      if (!deck.exists()) {
        const error = new TeenyError('We had some trouble finding your deck. Please try again.', {
          name: 'ObjectNotFoundError'
        })

        return { success: false, error }
      }

      const { imageFile, ...deckData } = deck.data()
      const { url, name } = imageResponse.value
      transaction.update(deckRef, {
        ...deckData,
        image: { url, name }
      })
    })

    return { success: true, value: undefined }
  } catch (e) {
    return { success: false, error: TeenyError.fromError(e) }
  }
}

const deleteDeckById = async (id: string): TeenyResponse<void> => {
  const db = getFirestore()
  const deckRef = doc(db, 'Decks', id)

  try {
    const response = await deleteCardsByDeckID(id)

    if (!response.success) {
      return { success: false, error: response.error }
    }

    await deleteDoc(deckRef)
    return { success: true, value: undefined }
  } catch (e) {
    return { success: false, error: TeenyError.fromError(e) }
  }
}

export { createDeck, getUserDecks, getDeckById, deleteDeckById, updateDeckById }
