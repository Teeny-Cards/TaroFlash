import { TeenyError } from '@/utils/TeenyError'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

const uploadDeckPhoto = async (img: DeckImage): TeenyResponse<DeckImage> => {
  const storage = getStorage()
  let newImg = { name: img.name ?? '', url: img.url ?? '' }

  if (img.url && img.deleted) {
    try {
      const storageRef = ref(storage, `deck-photos/${img.name}`)
      await deleteObject(storageRef)
    } catch (e) {
      return { success: false, error: TeenyError.fromError(e) }
    }
  }

  if (img.newFile) {
    try {
      const storageRef = ref(storage, `deck-photos/${img.newFile.name}`)
      await uploadBytes(storageRef, img.newFile)
      const url = await getDownloadURL(storageRef)

      newImg = { name: img.newFile.name, url }
    } catch (e) {
      return { success: false, error: TeenyError.fromError(e) }
    }
  }

  return { success: true, value: newImg }
}

export { uploadDeckPhoto }
