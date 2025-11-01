<script lang="ts" setup>
import Card from '@/components/card/index.vue'
import { computed, onMounted, useTemplateRef, watch } from 'vue'
import UiListItem from '@/components/ui-kit/list-item.vue'
import UiRadio from '@/components/ui-kit/radio.vue'
import { type CardEditorMode } from '@/composables/card-bulk-editor'
import { useI18n } from 'vue-i18n'
import OptionsPopover from './options-popover.vue'
import {
  MAX_INPUT_LENGTH,
  type EditableCardValue,
  type EditableCardKey
} from '@/composables/card-bulk-editor'
import { useInputResizer } from '@/composables/input-resizer'
import UiButton from '@/components/ui-kit/button.vue'

const { card, mode, selected, active } = defineProps<{
  card: Card
  mode: CardEditorMode
  selected: boolean
  active: boolean
  is_duplicate?: boolean
}>()

const emit = defineEmits<{
  (e: 'selected'): void
  (e: 'deleted'): void
  (e: 'moved'): void
  (e: 'activated'): void
  (e: 'closed'): void
  (e: 'updated', id: number, column: EditableCardKey, value: EditableCardValue): void
}>()

const { t } = useI18n()
const { setupInput } = useInputResizer()

const front_input = useTemplateRef<HTMLTextAreaElement>('front-input')
const back_input = useTemplateRef<HTMLTextAreaElement>('back-input')

const disabled = computed(() => {
  return mode === 'select' || mode === 'view'
})

onMounted(() => {
  setupInput(front_input.value!)
  setupInput(back_input.value!)
})

function onClick() {
  if (mode !== 'select') return
  emit('selected')
}

function activate() {
  if (active) return
  emit('activated')
}

function deactivate() {
  emit('closed')
}

function onInput(e: Event) {
  const target = e.target as HTMLTextAreaElement
  const column = target.dataset['testid'] === 'front-input' ? 'front_text' : 'back_text'

  emit('updated', card.id!, column, target.value)
}

function togglePopover() {
  if (active) {
    deactivate()
  } else {
    activate()
  }
}

function onPageClick(e: Event) {
  const target = e.target as HTMLElement

  if (!target.closest(`[data-id="${card.id}"]`) && !target.closest('.options-popover')) {
    deactivate()
  }
}

watch(
  () => active,
  (new_value) => {
    if (new_value) {
      document.addEventListener('click', onPageClick)
    } else {
      document.removeEventListener('click', onPageClick)
    }
  }
)
</script>

<template>
  <ui-list-item
    data-testid="card-list__item"
    :data-id="card.id"
    :hover_effect="mode === 'select'"
    class="group"
    :class="{
      'mode-edit': mode === 'edit' && active,
      'mode-select cursor-pointer': mode === 'select',
      'mode-view': mode === 'view',
      duplicate: is_duplicate
    }"
    @click="onClick"
  >
    <template #before>
      <div class="flex h-full flex-col items-start relative">
        <card size="2xs" />
      </div>
    </template>

    <div class="flex w-full gap-4" :class="{ active }">
      <textarea
        data-testid="front-input"
        ref="front-input"
        class="card-list__input"
        :placeholder="t('card.placeholder-front')"
        :value="card.front_text"
        @focusin="activate"
        @input="onInput"
        :maxlength="MAX_INPUT_LENGTH"
      ></textarea>

      <textarea
        data-testid="back-input"
        ref="back-input"
        class="card-list__input"
        :placeholder="t('card.placeholder-back')"
        :value="card.back_text"
        @focusin="activate"
        @input="onInput"
        :maxlength="MAX_INPUT_LENGTH"
      ></textarea>
    </div>

    <template #after>
      <div
        v-if="mode !== 'select'"
        class="opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
          transition-opacity duration-50"
        :class="{ 'opacity-100 pointer-events-auto': active }"
      >
        <options-popover
          :open="active"
          @delete="emit('deleted')"
          @move="emit('moved')"
          @select="emit('selected')"
        >
          <ui-button
            data-testid="card-list__item-more-button"
            icon-only
            size="xs"
            :variant="active ? 'interaction' : 'muted'"
            :hover-audio="false"
            :icon-right="active ? 'check' : 'edit'"
            @click.stop="togglePopover"
          />
        </options-popover>
      </div>

      <ui-radio v-if="mode === 'select'" :checked="selected" @click.stop="emit('selected')" />
    </template>
  </ui-list-item>
</template>

<style>
.card-list__input {
  border-radius: var(--radius-4);
  width: 100%;
  resize: none;

  padding: 8px 12px;
  overflow: hidden;
}

.mode-edit textarea {
  color: var(--color-brown-700);
  outline: 2px solid var(--color-brown-300);
  background-color: var(--color-white);
}

.mode-select .card-list__input {
  pointer-events: none;
}

.active textarea {
  outline: 2px solid var(--color-blue-500);
}

.duplicate textarea {
  color: var(--color-red-500);
}
</style>
