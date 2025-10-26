<script lang="ts" setup>
import { useAudio } from '@/composables/audio'
import Card from '@/components/card/index.vue'
import { computed } from 'vue'
import UiButtonMenu from '@/components/ui-kit/button-menu.vue'
import UiButton from '@/components/ui-kit/button.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiListItem from '@/components/ui-kit/list-item.vue'
import UiRadio from '@/components/ui-kit/radio.vue'

const { card, mode, selected } = defineProps<{
  card: Card
  mode: 'edit' | 'view' | 'select'
  selected: boolean
}>()

const emit = defineEmits<{
  (e: 'selected'): void
  (e: 'deleted'): void
  (e: 'moved'): void
}>()

const audio = useAudio()
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
</script>

<template>
  <ui-list-item
    data-testid="card-list__item"
    :hover_effect="hover_mode"
    :class="{ 'cursor-pointer': hover_mode }"
    @click="onClick"
  >
    <template #before>
      <div class="flex h-full flex-col items-start">
        <card size="2xs" />
      </div>
    </template>

    <slot></slot>

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
