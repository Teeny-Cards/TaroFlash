<script setup lang="ts">
import { nextTick, onMounted, useTemplateRef, watch } from 'vue'
import { useRichTextEditor } from '@/composables/rich-text-editor'
import { type TextEditorUpdatePayload } from '@/composables/rich-text-editor'

const { delta, active, placeholder, disabled, uploadImage } = defineProps<{
  delta?: Object
  active: boolean
  placeholder?: string
  disabled?: boolean
  uploadImage?: (file: File) => Promise<string | undefined>
}>()

const emit = defineEmits<{
  (e: 'update', payload: TextEditorUpdatePayload): void
  (e: 'request-active'): void
}>()

const editor = useRichTextEditor()

const text_editor = useTemplateRef<HTMLDivElement>('text-editor')

onMounted(() => {
  if (!text_editor.value) return
  editor.render(text_editor.value, delta, { placeholder, readOnly: disabled })
})

async function onUpdate(payload: TextEditorUpdatePayload) {
  if (disabled) return
  emit('update', payload)
}

async function onMouseDown(e: MouseEvent) {
  if (!text_editor.value || disabled || active) return

  emit('request-active')
  await nextTick()
}

async function onDrop(e: DragEvent) {
  if (disabled || !uploadImage) return
  e.preventDefault()

  const dt = e.dataTransfer
  if (!dt) return

  const files = Array.from(dt.files)
  const imageFile = files.find((f) => f.type.startsWith('image/'))
  if (!imageFile) return

  const src = await uploadImage(imageFile)

  if (src) {
    editor.image({ url: src, id: imageFile.name })
  }
}

watch(
  () => active,
  (new_active, prev_active) => {
    if (!text_editor.value) return

    if (new_active && !prev_active) {
      editor.activate(text_editor.value)
      editor.subscribe(onUpdate)
    } else if (!new_active && prev_active) {
      editor.deactivate(text_editor.value)
      editor.unsubscribe(onUpdate)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div
    data-testid="text-editor"
    :class="{ 'text-editor--active': active }"
    ref="text-editor"
    @mousedown="onMouseDown"
    @dragover.prevent
    @drop="onDrop"
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

.ql-image {
  max-height: 100%;
  max-width: 100%;

  position: relative;
}
.ql-image img {
  max-height: 100%;
  max-width: 100%;
}

.ql-image button {
  display: none;

  position: absolute;
  top: 10px;
  right: 10px;

  width: 35px;
  height: 35px;

  color: var(--color-white);
  background-color: var(--color-red-500);
  border-radius: var(--radius-full);

  cursor: pointer;
  user-select: none;
}

.text-editor--active .ql-image:hover img {
  padding: 4px;

  border-radius: 30px;
  background-color: var(--color-brown-300);
  cursor: default;
}

.text-editor--active .ql-image:hover button {
  display: block;
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
