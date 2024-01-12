import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const uploadDeckPhoto = async (file: ArrayBuffer) => {
  const storage = getStorage()
  const storageRef = ref(storage, 'deck-photos')

  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}
