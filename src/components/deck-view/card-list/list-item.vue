<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

export type NavigationData = {
  selection_start?: number
  direction: 'up' | 'down'
}

import Card from '@/components/card.vue'
import { useTemplateRef, watchEffect, computed } from 'vue'

const { editing, focused, selectedColumn, selectionStart, card } = defineProps<{
  card: Card
  editing: boolean
  focused: boolean
  selectionStart: number
  selectedColumn: 'front' | 'back'
}>()

const emit = defineEmits<{
  (e: 'focusin', direction: 'left' | 'right'): void
  (e: 'focusout'): void
  (e: 'navigated', data: NavigationData): void
  (e: 'updated', id: number, prop: 'front_text' | 'back_text', value: string): void
  (e: 'selected', id: number): void
  (e: 'deleted', id: number): void
}>()

const front_input = useTemplateRef<HTMLTextAreaElement>('front-input')
const back_input = useTemplateRef<HTMLTextAreaElement>('back-input')

const inputMap = {
  front: front_input,
  back: back_input
} as const

const textareaClass = computed(() => ({
  'text-grey-700 resize-none transition-all duration-100': true,
  'h-5.25': !editing,
  'rounded-5 bg-white p-6 focus:outline-none': editing,
  'h-85.5 ring-2 ring-blue-500': focused && editing,
  'h-27.75': !focused && editing
}))

const actions = [
  {
    label: 'Select',
    action: () => emit('selected', card.id!),
    inverted: true,
    iconRight: 'check'
  },
  {
    label: 'Move',
    action: () => {},
    inverted: true,
    iconRight: 'arrow-forward'
  },
  {
    label: 'Delete',
    action: () => emit('deleted', card.id!),
    variant: 'danger',
    inverted: true,
    iconRight: 'delete'
  }
]

function emitDirection(e: KeyboardEvent) {
  if (!e.altKey) return
  const target = e.target as HTMLTextAreaElement

  const keyMap: { [key: string]: () => void } = {
    ArrowUp: () => emit('navigated', { selection_start: target.selectionStart, direction: 'up' }),
    ArrowDown: () =>
      emit('navigated', { selection_start: target.selectionStart, direction: 'down' }),
    ArrowLeft: () => emit('focusin', 'left'),
    ArrowRight: () => emit('focusin', 'right')
  }

  keyMap[e.key]?.()
}

function onFocus(e: Event) {
  const target = e.target as HTMLTextAreaElement
  target.scrollIntoView({ behavior: 'smooth', block: 'center' })

  if (target === front_input.value) emit('focusin', 'left')
  if (target === back_input.value) emit('focusin', 'right')
}

function onInput(e: Event, prop: 'front_text' | 'back_text') {
  const target = e.target as HTMLTextAreaElement
  emit('updated', card.id!, prop, target.value)
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
    data-testid="card-list__item"
    class="text-grey-700 grid w-full grid-cols-[auto_1fr_1fr_auto] items-center gap-6 py-3"
    :class="{ 'items-start': editing }"
  >
    <card size="2xs" />
    <textarea
      data-testid="card-list__item-front-input"
      ref="front-input"
      :placeholder="t('card.placeholder-front')"
      :class="textareaClass"
      :disabled="!editing"
      :value="card.front_text"
      @focusin="onFocus"
      @focusout="emit('focusout')"
      @input="onInput($event, 'front_text')"
    />

    <textarea
      data-testid="card-list__item-back-input"
      ref="back-input"
      :placeholder="t('card.placeholder-back')"
      :class="textareaClass"
      :disabled="!editing"
      :value="card.back_text"
      @focusin="onFocus"
      @focusout="emit('focusout')"
      @input="onInput($event, 'back_text')"
    />

    <ui-kit:button-menu :actions="actions" v-if="!editing">
      <template #trigger="{ toggleDropdown }">
        <ui-kit:button
          v-if="!editing"
          data-testid="card-list__item-more-button"
          icon-only
          variant="muted"
          size="small"
          @click="toggleDropdown"
        >
          <ui-kit:icon src="more" />
        </ui-kit:button>
      </template>
    </ui-kit:button-menu>
  </div>
</template>
