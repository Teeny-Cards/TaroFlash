<script lang="ts" setup>
export type NavigationData = {
  selection_start: number
  direction: 'up' | 'down'
}

import Card from '@/components/card.vue'
import { useTemplateRef, watchEffect, computed } from 'vue'

const { focused, selectedColumn, selectionStart } = defineProps<{
  front_text: string
  back_text: string
  editing: boolean
  focused: boolean
  selectionStart: number
  selectedColumn: 'front' | 'back'
}>()

const emit = defineEmits<{
  (e: 'focused', direction: 'left' | 'right'): void
  (e: 'navigated', data: NavigationData): void
}>()

const front_input = useTemplateRef<HTMLTextAreaElement>('front-input')
const back_input = useTemplateRef<HTMLTextAreaElement>('back-input')

const inputMap = {
  front: front_input,
  back: back_input
} as const

const textareaClass = computed(() => ({
  'rounded-5 text-grey-700 resize-none bg-white p-6 transition-[height] duration-75 focus:outline-none':
    true,
  'h-85.5 ring-2 ring-blue-500': focused,
  'h-27.75': !focused
}))

function emitDirection(e: KeyboardEvent) {
  if (!e.altKey) return
  const target = e.target as HTMLTextAreaElement

  const keyMap: { [key: string]: () => void } = {
    ArrowUp: () => emit('navigated', { selection_start: target.selectionStart, direction: 'up' }),
    ArrowDown: () =>
      emit('navigated', { selection_start: target.selectionStart, direction: 'down' }),
    ArrowLeft: () => emit('focused', 'left'),
    ArrowRight: () => emit('focused', 'right')
  }

  keyMap[e.key]?.()
}

function onFocus(e: Event) {
  const target = e.target as HTMLTextAreaElement
  target.scrollIntoView({ behavior: 'smooth', block: 'center' })

  if (target === front_input.value) emit('focused', 'left')
  if (target === back_input.value) emit('focused', 'right')
}

watchEffect(() => {
  if (focused) {
    document.addEventListener('keydown', emitDirection)

    const inputRef = inputMap[selectedColumn].value
    if (inputRef) {
      inputRef.focus()
      inputRef.setSelectionRange(selectionStart, selectionStart)
    }
  } else {
    document.removeEventListener('keydown', emitDirection)
  }
})
</script>

<template>
  <div
    v-if="editing"
    data-testid="card-list__item"
    class="text-grey-700 grid w-full grid-cols-[auto_1fr_1fr] gap-6 py-3"
  >
    <card size="2xs" />
    <textarea
      data-testid="card-list__item-front-input"
      :class="textareaClass"
      ref="front-input"
      @focus="onFocus"
      :value="front_text"
    />

    <textarea
      data-testid="card-list__item-back-input"
      :class="textareaClass"
      ref="back-input"
      @focus="onFocus"
      :value="back_text"
    />
  </div>
  <div
    v-else
    data-testid="card-list__item"
    class="text-grey-700 grid w-full cursor-pointer grid-cols-[auto_1fr_1fr_auto] items-center gap-6 py-3"
  >
    <card size="2xs" />
    <p>{{ front_text }}</p>
    <p>{{ back_text }}</p>
    <ui-kit:button icon-only variant="muted" size="small">
      <ui-kit:icon src="more" />
    </ui-kit:button>
  </div>
</template>
