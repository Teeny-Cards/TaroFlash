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
      contenteditable
      class="w-full h-full outline-none"
      @update="onUpdate"
    ></div>
    <span
      v-if="!has_content"
      class="absolute inset-0 flex items-center justify-center text-center pointer-events-none
        text-brown-300"
    >
      {{ placeholder }}
    </span>
  </div>
</template>

<style>
.ql-editor {
  height: 100%;
  width: 100%;
  outline: none;
}

.ql-editor hr {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.ql-align-center {
  text-align: center;
}
.ql-align-right {
  text-align: right;
}
.ql-align-justify {
  text-align: justify;
}
.ql-align-left {
  text-align: left;
}
</style>
