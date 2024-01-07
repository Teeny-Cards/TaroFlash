import { useUserStore } from '../stores/user'
import { getFirestore } from 'firebase/firestore'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const handleUserAuthStateChange = async (user: any): Promise<Boolean> => {
  const userStore = useUserStore()

  if (!user) {
    userStore.setUser()
    return false
  }

  const db = getFirestore()
  const userRef = doc(db, 'Users', user.uid)
  const docSnap = await getDoc(userRef)

  let userProfile: UserProfile
  if (!docSnap.exists()) {
    userProfile = {
      email: user.email,
      username: user.displayName || 'New User',
      userId: user.uid
    }
    await setDoc(userRef, userProfile)
  } else {
    userProfile = {
      ...(docSnap.data() as UserProfile),
      userId: user.uid
    }
  }

  userStore.setUser(userProfile)
  return true
}

export { handleUserAuthStateChange }
