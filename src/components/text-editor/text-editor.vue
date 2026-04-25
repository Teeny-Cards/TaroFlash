<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue'

type TextEditorProps = {
  disabled?: boolean
  content?: string
  placeholder?: string
  attributes?: CardAttributes
}

const { disabled, content } = defineProps<TextEditorProps>()

const emit = defineEmits<{
  (e: 'update', text: string): void
  (e: 'focus'): void
  (e: 'blur'): void
}>()

const text_editor = useTemplateRef<HTMLDivElement>('text-editor')
const has_content = ref(Boolean(content?.length))

onMounted(() => {
  if (!text_editor.value) return
  text_editor.value.textContent = content ?? ''
})

watch(
  () => content,
  (next) => {
    if (!text_editor.value) return
    const value = next ?? ''
    if (text_editor.value.textContent === value) return
    text_editor.value.textContent = value
    has_content.value = value.length > 0
  }
)

function on_input(event: Event) {
  const text = (event.target as HTMLElement).innerText ?? ''
  has_content.value = text.length > 0
  emit('update', text)
}

function focus() {
  text_editor.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div data-testid="text-editor-container" class="relative">
    <div
      data-testid="text-editor"
      ref="text-editor"
      class="text-editor"
      :contenteditable="disabled ? 'false' : 'plaintext-only'"
      :class="[
        `text-editor--size-${attributes?.text_size ?? 'large'}`,
        `text-editor--h-${attributes?.horizontal_alignment ?? 'center'}`,
        `text-editor--v-${attributes?.vertical_alignment ?? 'center'}`
      ]"
      @input="on_input"
      @focus="emit('focus')"
      @blur="emit('blur')"
    ></div>
    <span
      v-if="!has_content && !disabled"
      data-testid="text-editor__placeholder"
      class="text-editor__placeholder"
    >
      {{ placeholder }}
    </span>
  </div>
</template>

<style>
.text-editor,
.text-editor-container {
  width: 100%;
  height: 100%;
  outline: none;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

/* Horizontal alignment */
.text-editor--h-left {
  text-align: left;
}

.text-editor--h-center {
  text-align: center;
}

.text-editor--h-right {
  text-align: right;
}

/* Vertical alignment */
.text-editor--v-top {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.text-editor--v-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.text-editor--v-bottom {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.text-editor__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
  color: var(--color-brown-300);
}

.text-editor {
  font-size: var(--editor-p);
  line-height: var(--editor-p-lh);
}

.text-editor--size-small {
  --editor-p: var(--text-lg);
  --editor-p-lh: var(--text-lg--line-height);
}

.text-editor--size-medium {
  --editor-p: var(--text-2xl);
  --editor-p-lh: var(--text-2xl--line-height);
}

.text-editor--size-large {
  --editor-p: var(--text-4xl);
  --editor-p-lh: var(--text-4xl--line-height);
}

.text-editor--size-x-large {
  --editor-p: var(--text-5xl);
  --editor-p-lh: var(--text-5xl--line-height);
}

.text-editor--size-huge {
  --editor-p: var(--text-6xl);
  --editor-p-lh: var(--text-6xl--line-height);
}

.text-editor--size-ginormous {
  --editor-p: var(--text-7xl);
  --editor-p-lh: var(--text-7xl--line-height);
}
</style>
