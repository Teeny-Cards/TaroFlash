<script lang="ts" setup>
import { useAudio } from '@/composables/audio'
import Card from '@/components/card/index.vue'
import { computed } from 'vue'

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
  <ui-kit:list-item
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
      <ui-kit:button-menu v-if="mode !== 'select'" :actions="actions">
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

      <ui-kit:radio v-if="mode === 'select'" :checked="selected" @click.stop="emit('selected')" />
    </template>
  </ui-kit:list-item>
</template>
