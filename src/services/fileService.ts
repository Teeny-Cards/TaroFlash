import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const uploadDeckPhoto = async (file: File) => {
  const storage = getStorage()
  const storageRef = ref(storage, `deck-photos/${file.name}`)

  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export { uploadDeckPhoto }
