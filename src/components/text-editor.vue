<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue'
import { useMdEditor } from '@/composables/md-editor'

const { value = '', active } = defineProps<{
  value: string
  active: boolean
}>()

const emit = defineEmits<{
  (e: 'update', value: string): void
}>()

const editor = useMdEditor()

const el = useTemplateRef<HTMLDivElement>('text-editor')

const composing = ref(false)
const lastMd = ref('')
let squelch = false

onMounted(() => {
  lastMd.value = value
  if (!active) renderFromMd(lastMd.value)
})

function renderFromMd(mdText: string) {
  if (!el.value) return
  el.value.innerHTML = editor.deserialize(mdText)
}

function serializeFromDom(): string {
  return editor.serialize(el.value?.innerHTML ?? '')
}

function onCompositionEnd() {
  composing.value = false
  onInput()
}

function onInput() {
  if (composing.value) return
  const md = serializeFromDom()

  if (md !== lastMd.value) {
    lastMd.value = md
    squelch = true // prevent the ensuing prop update from re-rendering
    emit('update', md)
    queueMicrotask(() => (squelch = false))
  }
}

watch(
  () => active,
  (new_active, prev_active) => {
    if (!el.value) return
    if (new_active && !prev_active) {
      lastMd.value = value
      renderFromMd(lastMd.value)
      editor.setActive(el.value)
    } else if (!new_active && prev_active) {
      const md = serializeFromDom()

      if (md !== lastMd.value) {
        lastMd.value = md
        emit('update', md)
      }

      editor.deferDeactivate(el.value)
    }
  },
  { immediate: true }
)

watch(
  () => value,
  (new_value) => {
    if (squelch || new_value === lastMd.value) return // ignore our own input echo

    lastMd.value = new_value
    // Only re-render when NOT active to avoid caret jumps
    if (!active) renderFromMd(new_value)
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
    @compositionstart="composing = true"
    @compositionend="onCompositionEnd"
    @input.stop="onInput"
  ></div>
</template>
