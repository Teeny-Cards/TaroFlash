<script lang="ts" setup>
import { useAudio } from '@/composables/use-audio'
import Card from '@/components/card.vue'

const { card, mode, selected } = defineProps<{
  card: Card
  mode: 'edit' | 'view' | 'select'
  selected: boolean
}>()

const emit = defineEmits<{
  (e: 'selected', id?: number): void
  (e: 'deleted', id?: number): void
  (e: 'moved', id?: number): void
}>()

const audio = useAudio()

const actions = [
  {
    label: 'Select',
    action: () => emit('selected', card.id),
    inverted: true,
    iconRight: 'check'
  },
  {
    label: 'Move',
    action: () => emit('moved', card.id),
    inverted: true,
    iconRight: 'arrow-forward'
  },
  {
    label: 'Delete',
    action: () => emit('deleted', card.id),
    variant: 'danger',
    inverted: true,
    iconRight: 'delete'
  }
]

function onMouseEnter() {
  if (mode !== 'edit') return
  audio.play('click_04')
}
</script>

<template>
  <ui-kit:list-item
    class="text-grey-700"
    :show-background="mode === 'edit'"
    @mouseenter="onMouseEnter"
  >
    <template #before>
      <div class="flex h-full flex-col items-start">
        <card size="2xs" />
      </div>
    </template>

    <template #default>
      <slot></slot>
    </template>

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

      <ui-kit:radio
        v-if="mode === 'select'"
        :checked="selected"
        @change="emit('selected', card.id)"
      />
    </template>
  </ui-kit:list-item>
</template>
