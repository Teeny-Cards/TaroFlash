import { TeenyError } from '@/utils/teenyError'
import { getFirestore, Firestore } from 'firebase/firestore'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const handleUserAuthStateChange = async (user: any): Promise<UserProfile> => {
  if (!user) {
    throw new TeenyError('User is not logged in', { name: 'AuthenticationError' })
  }

  const db = getFirestore()

  try {
    const userProfile = await fetchOrCreateUserProfile(user, db)
    return userProfile
  } catch (e: any) {
    throw TeenyError.fromError(e)
  }
}

const fetchOrCreateUserProfile = async (user: any, db: Firestore): Promise<UserProfile> => {
  const userRef = doc(db, 'Users', user.uid)

  try {
    const docSnap = await getDoc(userRef)

    if (docSnap.exists()) {
      const userProfile = {
        ...(docSnap.data() as UserProfile),
        userId: user.uid
      }

      return userProfile
    }

    const newUserProfile = {
      email: user.email,
      username: user.displayName || 'New User',
      userId: user.uid
    }

    await setDoc(userRef, newUserProfile)

    return newUserProfile
  } catch (e) {
    throw TeenyError.fromError(e)
  }
}

export { handleUserAuthStateChange }
