<template>
  <input
    type="file"
    @change="handleFileChange"
    accept="image/*"
    class="absolute inset-0 cursor-pointer opacity-0"
  />

  <slot></slot>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'imageUploaded', preview: string, file: File): void
}>()

const selectedFile = ref()

function handleFileChange(event: Event): void {
  const input = event.target as HTMLInputElement

  if (input.files) {
    const file = input.files[0]

    if (file && file.type.startsWith('image/')) {
      selectedFile.value = file
      getImagePreview(file)
    }
  }
}

function getImagePreview(file: File): void {
  const reader = new FileReader()

  reader.onload = (e: ProgressEvent<FileReader>) => {
    if (e.target) {
      emit('imageUploaded', e.target.result as string, selectedFile.value)
    }
  }

  reader.readAsDataURL(file)
}
</script>
