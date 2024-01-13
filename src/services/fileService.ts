import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

const uploadDeckPhoto = async (img: DeckImage): Promise<DeckImage> => {
  const storage = getStorage()
  let newImg = img

  if (img.url && img.deleted) {
    const storageRef = ref(storage, `deck-photos/${img.name}`)
    await deleteObject(storageRef)
    newImg = { ...img, name: '', url: '', deleted: false }
  }

  if (img.newFile) {
    const storageRef = ref(storage, `deck-photos/${img.newFile.name}`)
    await uploadBytes(storageRef, img.newFile)
    const url = await getDownloadURL(storageRef)

    newImg = { name: img.newFile.name, url }
  }

  return newImg
}

export { uploadDeckPhoto }
