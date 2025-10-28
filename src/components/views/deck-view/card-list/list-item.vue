<script lang="ts" setup>
import { useAudio } from '@/composables/audio'
import Card from '@/components/card/index.vue'
import { computed } from 'vue'
import UiButtonMenu from '@/components/ui-kit/button-menu.vue'
import UiButton from '@/components/ui-kit/button.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiListItem from '@/components/ui-kit/list-item.vue'
import UiRadio from '@/components/ui-kit/radio.vue'
import { type CardEditorMode } from '@/composables/card-bulk-editor'
import { useI18n } from 'vue-i18n'
import {
  MAX_INPUT_LENGTH,
  type EditableCardValue,
  type EditableCardKey
} from '@/composables/card-bulk-editor'

const { card, mode, selected } = defineProps<{
  card: Card
  mode: CardEditorMode
  selected: boolean
  active: boolean
}>()

const emit = defineEmits<{
  (e: 'selected'): void
  (e: 'deleted'): void
  (e: 'moved'): void
  (e: 'activated'): void
  (e: 'updated', id: number, column: EditableCardKey, value: EditableCardValue): void
}>()

const audio = useAudio()
const { t } = useI18n()

const hover_mode = computed(() => {
  return mode === 'select'
})

const actions = [
  {
    label: 'Select',
    action: () => emit('selected'),
    inverted: true,
    iconRight: 'check'
  },
  {
    label: 'Move',
    action: () => emit('moved'),
    inverted: true,
    iconRight: 'arrow-forward'
  },
  {
    label: 'Delete',
    action: () => emit('deleted'),
    variant: 'danger',
    inverted: true,
    iconRight: 'delete'
  }
]

function onClick() {
  if (mode !== 'select') return
  audio.play('etc_camera_shutter')
  emit('selected')
}

function onClickEdit() {
  emit('activated')
}

function onInput(e: Event) {
  const target = e.target as HTMLTextAreaElement
  const column = target.dataset['testid'] === 'front-input' ? 'front_text' : 'back_text'

  emit('updated', card.id!, column, target.value)
}
</script>

<template>
  <ui-list-item
    data-testid="card-list__item"
    :hover_effect="hover_mode"
    :class="{
      'cursor-pointer': hover_mode,
      'mode-edit': mode === 'edit' || (mode === 'edit-one' && active),
      'mode-select': mode === 'select',
      'mode-view': mode === 'view'
    }"
    @click="onClick"
  >
    <template #before>
      <div class="flex h-full flex-col items-start">
        <card size="2xs" @click.stop="onClickEdit" />
      </div>
    </template>

    <div class="flex w-full gap-4" :class="{ active }">
      <textarea
        data-testid="front-input"
        class="card-list__input"
        :placeholder="t('card.placeholder-front')"
        :value="card.front_text"
        :disabled="mode !== 'edit' && mode !== 'edit-one'"
        @focusin="emit('activated')"
        @input="onInput"
        :maxlength="MAX_INPUT_LENGTH"
      ></textarea>

      <textarea
        data-testid="back-input"
        class="card-list__input"
        :placeholder="t('card.placeholder-back')"
        :value="card.back_text"
        :disabled="mode !== 'edit' && mode !== 'edit-one'"
        @focusin="emit('activated')"
        @input="onInput"
        :maxlength="MAX_INPUT_LENGTH"
      ></textarea>
    </div>

    <template #after>
      <ui-button-menu v-if="mode !== 'select'" :actions="actions">
        <template #trigger="{ toggleDropdown }">
          <ui-button
            data-testid="card-list__item-more-button"
            icon-only
            variant="muted"
            size="small"
            @click="toggleDropdown"
          >
            <ui-icon src="more" />
          </ui-button>
        </template>
      </ui-button-menu>

      <ui-radio v-if="mode === 'select'" :checked="selected" @click.stop="emit('selected')" />
    </template>
  </ui-list-item>
</template>

<style>
.card-list__input {
  transition: height 100ms ease-in-out;

  border-radius: var(--radius-4);
  width: 100%;
  height: 58px;
  resize: none;

  padding: 8px 12px;
  overflow: hidden;
}

.mode-edit textarea {
  color: var(--color-brown-700);
  outline: 2px solid var(--color-brown-300);
  background-color: var(--color-white);
  height: 260px;
}

.mode-select .card-list__input {
  pointer-events: none;
}

.active textarea {
  outline: 2px solid var(--color-blue-500);
}
</style>
