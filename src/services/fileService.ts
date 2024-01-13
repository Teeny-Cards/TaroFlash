import { TeenyError } from '@/utils/TeenyError'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

const uploadDeckPhoto = async (img: DeckImage): TeenyResponse<DeckImage> => {
  const storage = getStorage()
  let newImg = img

  if (img.url && img.deleted) {
    try {
      const storageRef = ref(storage, `deck-photos/${img.name}`)
      await deleteObject(storageRef)
      newImg = { ...img, name: '', url: '', deleted: false }
    } catch (e) {
      return { success: false, error: new TeenyError(e) }
    }
  }

  if (img.newFile) {
    try {
      const storageRef = ref(storage, `deck-photos/${img.newFile.name}`)
      await uploadBytes(storageRef, img.newFile)
      const url = await getDownloadURL(storageRef)

      newImg = { name: img.newFile.name, url }
    } catch (e) {
      return { success: false, error: new TeenyError(e) }
    }
  }

  return { success: true, value: newImg }
}

export { uploadDeckPhoto }
