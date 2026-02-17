<script setup lang="ts">
import { onMounted, useTemplateRef, computed } from 'vue'
import { useBlockEditor } from '@/composables/use-block-editor'

const { placeholder, disabled, content } = defineProps<{
  content?: string
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', text: string): void
  (e: 'focusin', event: Event): void
  (e: 'focusout', event: Event): void
}>()

const text_editor = useTemplateRef('text-editor')
const editor = useBlockEditor(text_editor, { content })

const has_content = computed(() => {
  return (content?.length ?? 0) > 0
})

function onUpdate(e: CustomEvent) {
  emit('update', e.detail)
}
</script>

<template>
  <div data-testid="text-editor-container" class="relative">
    <div
      data-testid="text-editor"
      ref="text-editor"
      :contenteditable="!disabled"
      class="w-full h-full outline-none **:[h1]:text-6xl **:[h2]:text-5xl **:[h3]:text-3xl
        **:[p]:text-base **:[li]:text-base **:[ul]:list-disc **:[ul]:list-inside"
      @update="onUpdate"
    ></div>
    <span
      v-if="!has_content && !disabled"
      class="absolute inset-0 flex items-center justify-center text-center pointer-events-none
        text-brown-300"
    >
      {{ placeholder }}
    </span>
  </div>
</template>
