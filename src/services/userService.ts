import { TeenyError } from '@/utils/TeenyError'
import { getFirestore, Firestore } from 'firebase/firestore'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const handleUserAuthStateChange = async (user: any): TeenyResponse<UserProfile> => {
  if (!user) {
    const error = new TeenyError('User is not logged in', { name: 'AuthenticationError' })
    return { success: false, error }
  }

  const db = getFirestore()
  const response = await fetchOrCreateUserProfile(user, db)

  if (response.success) {
    return { success: true, value: response.value }
  } else {
    const error = new TeenyError('Failed to fetch or create user profile', {
      name: 'AuthenticationError'
    })

    return { success: false, error }
  }
}

const fetchOrCreateUserProfile = async (user: any, db: Firestore): TeenyResponse<UserProfile> => {
  const userRef = doc(db, 'Users', user.uid)

  try {
    const docSnap = await getDoc(userRef)

    if (docSnap.exists()) {
      const userProfile = {
        ...(docSnap.data() as UserProfile),
        userId: user.uid
      }

      return { success: true, value: userProfile }
    }

    const newUserProfile = {
      email: user.email,
      username: user.displayName || 'New User',
      userId: user.uid
    }

    await setDoc(userRef, newUserProfile)
    return { success: true, value: newUserProfile }
  } catch (e) {
    return { success: false, error: TeenyError.fromError(e) }
  }
}

export { handleUserAuthStateChange }
