<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import logger from '@/utils/logger'

export type ImageUploadPayload = {
  preview: string
  file: File
}

defineProps<{ allow_drop?: boolean }>()

const emit = defineEmits<{
  (e: 'image-uploaded', event: ImageUploadPayload): void
}>()

const loading = ref(false)
const drag_counter = ref(0)
const dragging = computed(() => drag_counter.value > 0)

const fileInput = useTemplateRef<HTMLInputElement>('fileInput')
const dropZone = useTemplateRef<HTMLDivElement>('dropZone')

onMounted(() => {
  const el = dropZone.value
  if (!el) return
  el.addEventListener('dragenter', onDragEnter)
  el.addEventListener('dragleave', onDragLeave)
  el.addEventListener('dragover', onDragOver)
  el.addEventListener('drop', onDrop)
})

onBeforeUnmount(() => {
  const el = dropZone.value
  if (!el) return
  el.removeEventListener('dragenter', onDragEnter)
  el.removeEventListener('dragleave', onDragLeave)
  el.removeEventListener('dragover', onDragOver)
  el.removeEventListener('drop', onDrop)
})

function onDragEnter(e: DragEvent) {
  e.preventDefault()
  drag_counter.value++
}

function onDragLeave(e: DragEvent) {
  e.preventDefault()
  drag_counter.value--
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  drag_counter.value = 0
  const file = e.dataTransfer?.files[0]
  if (file) processFile(file)
}

function triggerDialog() {
  fileInput.value?.click()
}

async function handleFileChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) processFile(file)
  // Reset so the same file can be re-selected
  input.value = ''
}

async function processFile(file: File): Promise<void> {
  if (!file.type.startsWith('image/')) return

  loading.value = true
  try {
    const preview = await getImagePreview(file)
    emit('image-uploaded', { preview, file })
  } catch (err) {
    logger.error((err as Error).message)
  } finally {
    loading.value = false
  }
}

function getImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    fr.onerror = reject
    fr.onload = (e) => resolve(e.target!.result as string)
    fr.readAsDataURL(file)
  })
}
</script>

<template>
  <div ref="dropZone">
    <slot :trigger="triggerDialog" :loading="loading" :dragging="dragging" />
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="sr-only"
      @change="handleFileChange"
    />
  </div>
</template>
