<script setup lang="ts">
import { onMounted, useTemplateRef, watch } from 'vue'
import { useRichTextEditor } from '@/composables/rich-text-editor'

export type TextEditorUpdatePayload = {
  delta: Object
  text?: string
}

const { delta, active, placeholder, disabled } = defineProps<{
  delta?: Object
  active: boolean
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', payload: TextEditorUpdatePayload): void
}>()

const editor = useRichTextEditor()

const text_editor = useTemplateRef<HTMLDivElement>('text-editor')

onMounted(() => {
  if (!text_editor.value) return
  editor.render(text_editor.value, delta, placeholder)
})

async function onUpdate(delta: any, text?: string) {
  if (disabled) return
  emit('update', { delta, text })
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
    :contenteditable="!disabled"
    tabindex="0"
    ref="text-editor"
    @input.stop
  ></div>
</template>
