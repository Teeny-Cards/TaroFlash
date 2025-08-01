<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useAudio } from '@/composables/use-audio'

const { t } = useI18n()
const audio = useAudio()

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
  'text-grey-700 resize-none transition-all duration-100 group-hover:bg-white py-2 px-3 rounded-4 focus:outline-none':
    true,
  'h-14.5 ring-1 ring-brown-100': !editing,
  'rounded-5 bg-white p-6 h-46 ring-2 ring-blue-500': editing
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
    class="text-grey-700 group relative grid w-full grid-cols-[auto_1fr_1fr_auto] items-center gap-6 py-3"
    @mouseenter="audio.play('click_04')"
    @focusout="emit('focusout')"
  >
    <div
      class="rounded-6 bg-brown-300 absolute top-1 -right-3 bottom-1 -left-3 -z-1 hidden group-hover:block"
    ></div>

    <div class="flex h-full flex-col items-start">
      <card size="2xs" />
    </div>

    <textarea
      data-testid="card-list__item-front-input"
      ref="front-input"
      :placeholder="t('card.placeholder-front')"
      :class="textareaClass"
      :value="card.front_text"
      @focusin="onFocus"
      @input="onInput($event, 'front_text')"
    />

    <textarea
      data-testid="card-list__item-back-input"
      ref="back-input"
      :placeholder="t('card.placeholder-back')"
      :class="textareaClass"
      :value="card.back_text"
      @focusin="onFocus"
      @input="onInput($event, 'back_text')"
    />

    <ui-kit:button-menu :actions="actions">
      <template #trigger="{ toggleDropdown }">
        <ui-kit:button
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
