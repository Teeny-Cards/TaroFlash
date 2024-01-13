import { TeenyError } from '@/utils/TeenyError'
import { useUserStore } from '../stores/user'
import { getFirestore, Firestore } from 'firebase/firestore'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const handleUserAuthStateChange = async (user: any): TeenyResponse<Boolean> => {
  const userStore = useUserStore()

  if (!user) {
    userStore.setUser()
    userStore.setLoading(false)
    const error = new TeenyError('User is not logged in')
    error.name = 'AuthenticationError'
    return { success: false, error }
  }

  const db = getFirestore()
  const userProfile = await fetchOrCreateUserProfile(user, db)

  userStore.setUser(userProfile)
  userStore.setLoading(false)
  return { success: true, value: true }
}

const fetchOrCreateUserProfile = async (user: any, db: Firestore) => {
  const userRef = doc(db, 'Users', user.uid)
  const docSnap = await getDoc(userRef)

  if (docSnap.exists()) {
    return {
      ...(docSnap.data() as UserProfile),
      userId: user.uid
    }
  }

  const newUserProfile = {
    email: user.email,
    username: user.displayName || 'New User',
    userId: user.uid
  }

  await setDoc(userRef, newUserProfile)
  return newUserProfile
}

export { handleUserAuthStateChange }
