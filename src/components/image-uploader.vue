<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import Logger from '@/utils/logger'

export type ImageUploadEvent = {
  preview: string
  file: File
}

const emit = defineEmits<{
  (e: 'image-uploaded', event: ImageUploadEvent): void
}>()

const selectedFile = ref()
const loading = ref(false)

const fileInput = useTemplateRef<HTMLInputElement>('fileInput')

function triggerDialog() {
  fileInput.value?.click()
}

async function handleFileChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement

  if (input.files) {
    const file = input.files[0]

    if (file && file.type.startsWith('image/')) {
      selectedFile.value = file

      try {
        const preview = await getImagePreview(file)
        emit('image-uploaded', { preview, file: selectedFile.value })
      } catch (err) {
        // TODO: Show error toast
        Logger.error((err as Error).message)
        throw err
      }
    }
  }
}

function getImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()

    fr.onerror = (err) => reject(err)
    fr.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target) {
        resolve(e.target.result as string)
      }
    }

    fr.readAsDataURL(file)
  })
}
</script>

<template>
  <input
    type="file"
    ref="fileInput"
    @change="handleFileChange"
    accept="image/*"
    class="absolute inset-0 cursor-pointer opacity-0"
  />
  <slot :trigger="triggerDialog" :loading="loading" />
</template>
