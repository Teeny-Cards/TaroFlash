<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useTextComposer } from '@/composables/use-text-composer'

const { disabled, content } = defineProps<{
  disabled?: boolean
  content?: string
  placeholder?: string
  attributes?: Card['attributes']
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
        `text-editor--${attributes?.text_size ?? '4xl'}`,
        `text-editor--${attributes?.horizontal_alignment ?? 'center'}`,
        `text-editor--${attributes?.vertical_alignment ?? 'middle'}`
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

.text-editor--center {
  text-align: center;
  justify-content: center;
}

.text-editor--middle {
  display: flex;
  align-items: center;
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

.text-editor h1 {
  font-size: var(--text-6xl);
  line-height: var(--text-6xl--line-height);
}

.text-editor h2 {
  font-size: var(--text-5xl);
  line-height: var(--text-5xl--line-height);
}

.text-editor h3 {
  font-size: var(--text-4xl);
  line-height: var(--text-4xl--line-height);
}

.text-editor p {
  font-size: var(--text-base);
  line-height: var(--text-base--line-height);
}
.text-editor--4xl p {
  font-size: var(--text-4xl);
  line-height: var(--text-4xl--line-height);
}

.text-editor ul {
  list-style-type: disc;
  list-style-position: inside;
}

.text-editor li {
  font-size: var(--text-base);
  line-height: var(--text-base--line-height);
}

.text-editor li span {
  margin-left: -8px;
}
</style>
