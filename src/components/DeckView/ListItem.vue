<template>
  <div
    class="hover:font-bold group px-4 py-2 w-full flex items-center justify-between cursor-pointer hover:bg-(image:--stripe-blue-bg) rounded-[28px]"
  >
    <div class="flex items-center gap-6 group-hover:text-white" tabindex="0" role="button">
      <Card size="xs" />
      {{ card.front_text }}
    </div>
    <span class="group-hover:text-white">{{ card.back_text }}</span>
    <div
      v-if="selectionModeActive"
      tid="select-radio-button"
      class="w-7 h-7 rounded-full flex justify-center items-center"
      :class="{
        'bg-blue-light': selected,
        'bg-white': !selected,
        'group-hover:ring-white group-hover:ring-3': selected
      }"
      @click.stop="emit('selectCard', card)"
    >
      <ui-kit:icon
        v-if="selected"
        src="check"
        class="text-blue"
        :class="{ 'text-white': selected }"
      />
    </div>
    <ui-kit:button-menu v-else :actions="moreMenuActions">
      <template #trigger="{ toggleDropdown }">
        <ui-kit:button
          @click="toggleDropdown"
          icon-only
          variant="muted"
          size="small"
          class="group-hover:bg-white group-hover:text-blue hover:bg-blue-light hover:ring-white hover:ring-3 hover:text-white"
        >
          <ui-kit:icon src="more" />
        </ui-kit:button>
      </template>
    </ui-kit:button-menu>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/card.vue'
import type { PropType } from 'vue'

const props = defineProps({
  card: {
    type: Object as PropType<Card>,
    required: true
  },
  selected: Boolean,
  selectionModeActive: Boolean
})

const emit = defineEmits<{
  (e: 'selectCard', card: Card): void
  (e: 'moveCard', card: Card): void
  (e: 'deleteCard', card: Card): void
}>()

const moreMenuActions: Object[] = [
  {
    label: 'Select',
    action: () => emit('selectCard', props.card),
    inverted: true,
    iconRight: 'check'
  },
  {
    label: 'Move',
    action: () => emit('moveCard', props.card),
    inverted: true,
    iconRight: 'arrow-forward'
  },
  {
    label: 'Delete',
    action: () => emit('deleteCard', props.card),
    variant: 'danger',
    inverted: true,
    iconRight: 'delete'
  }
]
</script>
