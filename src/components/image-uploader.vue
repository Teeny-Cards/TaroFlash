<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import { useLogger } from '@/composables/use-logger'

export type ImageUploadEvent = {
  preview: string
  file: File
}

const emit = defineEmits<{
  (e: 'image-uploaded', event: ImageUploadEvent): void
}>()

const selectedFile = ref<File>()
const loading = ref(false)
const dragging = ref(false)

const fileInput = useTemplateRef<HTMLInputElement>('fileInput')
const logger = useLogger()

onMounted(() => {
  document.addEventListener('dragover', startDrag)
  document.addEventListener('drop', endDrag)
  document.addEventListener('dragleave', endDrag)
})

onBeforeUnmount(() => {
  document.removeEventListener('dragover', startDrag)
  document.removeEventListener('drop', endDrag)
  document.removeEventListener('dragleave', endDrag)
})

function startDrag(e: DragEvent) {
  e.preventDefault()
  dragging.value = true
}

function endDrag(e: DragEvent) {
  e.preventDefault()
  dragging.value = false
}

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
        logger.error((err as Error).message)
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
  <div class="relative">
    <slot :trigger="triggerDialog" :loading="loading" :dragging="dragging" />

    <input
      type="file"
      ref="fileInput"
      @change="handleFileChange"
      accept="image/*"
      class="absolute inset-0 cursor-pointer opacity-0"
    />
  </div>
</template>
