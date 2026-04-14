<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useTextComposer } from '@/composables/use-text-composer'

const { disabled, content } = defineProps<{
  disabled?: boolean
  content?: string
  placeholder?: string
  attributes?: TextEditorAttributes
}>()

const emit = defineEmits<{
  (e: 'update', text: string): void
  (e: 'focus'): void
  (e: 'blur'): void
}>()

const text_editor = useTemplateRef('text-editor')

const { has_content, focus } = useTextComposer(text_editor, {
  content,
  disabled,
  onUpdate: (text: string) => emit('update', text),
  onFocus: () => emit('focus'),
  onBlur: () => emit('blur')
})

defineExpose({ focus })
</script>

<template>
  <div data-testid="text-editor-container" class="relative">
    <div
      data-testid="text-editor"
      ref="text-editor"
      class="text-editor"
      :class="[
        `text-editor--size-${attributes?.text_size ?? 'large'}`,
        `text-editor--h-${attributes?.horizontal_alignment ?? 'center'}`,
        `text-editor--v-${attributes?.vertical_alignment ?? 'center'}`
      ]"
    ></div>
    <span v-if="!has_content && !disabled" class="text-editor__placeholder">
      {{ placeholder }}
    </span>
  </div>
</template>

<style>
.text-editor {
  width: 100%;
  height: 100%;
  outline: none;
  color: var(--color-brown-700);
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

/* Size scale — each tier sets custom properties for p, h3, h2, h1 */
.text-editor--size-small {
  --editor-p: var(--text-base);
  --editor-p-lh: var(--text-base--line-height);
  --editor-h3: var(--text-lg);
  --editor-h3-lh: var(--text-lg--line-height);
  --editor-h2: var(--text-xl);
  --editor-h2-lh: var(--text-xl--line-height);
  --editor-h1: var(--text-2xl);
  --editor-h1-lh: var(--text-2xl--line-height);
}

.text-editor--size-medium {
  --editor-p: var(--text-lg);
  --editor-p-lh: var(--text-lg--line-height);
  --editor-h3: var(--text-xl);
  --editor-h3-lh: var(--text-xl--line-height);
  --editor-h2: var(--text-2xl);
  --editor-h2-lh: var(--text-2xl--line-height);
  --editor-h1: var(--text-3xl);
  --editor-h1-lh: var(--text-3xl--line-height);
}

.text-editor--size-large {
  --editor-p: var(--text-xl);
  --editor-p-lh: var(--text-xl--line-height);
  --editor-h3: var(--text-2xl);
  --editor-h3-lh: var(--text-2xl--line-height);
  --editor-h2: var(--text-3xl);
  --editor-h2-lh: var(--text-3xl--line-height);
  --editor-h1: var(--text-4xl);
  --editor-h1-lh: var(--text-4xl--line-height);
}

.text-editor--size-x-large {
  --editor-p: var(--text-2xl);
  --editor-p-lh: var(--text-2xl--line-height);
  --editor-h3: var(--text-3xl);
  --editor-h3-lh: var(--text-3xl--line-height);
  --editor-h2: var(--text-4xl);
  --editor-h2-lh: var(--text-4xl--line-height);
  --editor-h1: var(--text-5xl);
  --editor-h1-lh: var(--text-5xl--line-height);
}

.text-editor--size-huge {
  --editor-p: var(--text-3xl);
  --editor-p-lh: var(--text-3xl--line-height);
  --editor-h3: var(--text-4xl);
  --editor-h3-lh: var(--text-4xl--line-height);
  --editor-h2: var(--text-5xl);
  --editor-h2-lh: var(--text-5xl--line-height);
  --editor-h1: var(--text-6xl);
  --editor-h1-lh: var(--text-6xl--line-height);
}

.text-editor--size-ginormous {
  --editor-p: var(--text-4xl);
  --editor-p-lh: var(--text-4xl--line-height);
  --editor-h3: var(--text-5xl);
  --editor-h3-lh: var(--text-5xl--line-height);
  --editor-h2: var(--text-6xl);
  --editor-h2-lh: var(--text-6xl--line-height);
  --editor-h1: var(--text-7xl);
  --editor-h1-lh: var(--text-7xl--line-height);
}

/* Element rules read from the custom properties */
.text-editor p {
  font-size: var(--editor-p);
  line-height: var(--editor-p-lh);
}

.text-editor h1 {
  font-size: var(--editor-h1);
  line-height: var(--editor-h1-lh);
}

.text-editor h2 {
  font-size: var(--editor-h2);
  line-height: var(--editor-h2-lh);
}

.text-editor h3 {
  font-size: var(--editor-h3);
  line-height: var(--editor-h3-lh);
}

.text-editor ul {
  list-style-type: disc;
  list-style-position: inside;
}

.text-editor li {
  font-size: var(--editor-p);
  line-height: var(--editor-p-lh);
}

.text-editor li span {
  margin-left: -8px;
}
</style>
