<script setup lang="ts">
import { onMounted, useTemplateRef, watch } from 'vue'
import { useRichTextEditor } from '@/composables/rich-text-editor'

const { delta, active, placeholder } = defineProps<{
  delta?: Object
  active: boolean
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update', { delta, text }: { delta: Object; text?: string }): void
}>()

const editor = useRichTextEditor()

const text_editor = useTemplateRef<HTMLDivElement>('text-editor')

onMounted(() => {
  if (!text_editor.value) return
  editor.render(text_editor.value, delta, placeholder)
})

async function onUpdate(delta: any, text?: string) {
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
      editor.deferDeactivate(text_editor.value)
      editor.unsubscribe(onUpdate)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div
    data-testid="text-editor"
    data-md="true"
    contenteditable
    tabindex="0"
    ref="text-editor"
    @input.stop
  ></div>
</template>
