<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { useRichTextEditor } from '@/composables/rich-text-editor'
import { type TextEditorUpdatePayload } from '@/composables/rich-text-editor'

const { delta, placeholder, disabled } = defineProps<{
  delta?: Object
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', payload: TextEditorUpdatePayload): void
  (e: 'focusin', event: Event): void
  (e: 'focusout', event: Event): void
}>()

const editor = useRichTextEditor()

const text_editor = useTemplateRef<HTMLDivElement>('text-editor')

onMounted(() => {
  if (!text_editor.value) return
  editor.attachEditor(text_editor.value, delta, { placeholder, readOnly: disabled })
})
</script>

<template>
  <!-- The rich-text-editor composable will attach a quill editor to this element and emit events on it -->
  <div
    data-testid="text-editor"
    ref="text-editor"
    @update="emit('update', $event.detail)"
    @activate="emit('focusin', $event)"
    @deactivate="emit('focusout', $event)"
    @focusin.prevent
    @focusout.prevent
  ></div>
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

.ql-editor.ql-blank::before {
  content: attr(data-placeholder);

  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  color: var(--color-brown-300);
  text-align: center;
  pointer-events: none;
}
</style>
