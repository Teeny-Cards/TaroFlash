<template>
  <div
    class="group text-grey-700 flex w-full cursor-pointer items-center justify-between rounded-[28px] px-4 py-2
      hover:bg-(image:--stripe-blue-500-bg) hover:font-bold"
  >
    <div class="flex items-center gap-6 group-hover:text-white" tabindex="0" role="button">
      <Card size="2xs" />
      {{ card.front_text }}
    </div>

    <span class="group-hover:text-white">{{ card.back_text }}</span>

    <div
      v-if="selectionModeActive"
      tid="select-radio-button"
      class="flex h-7 w-7 items-center justify-center rounded-full"
      :class="{
        'bg-blue-500': selected,
        'bg-white': !selected,
        'group-hover:ring-3 group-hover:ring-white': selected
      }"
      @click.stop="emit('selectCard', card)"
    >
      <ui-kit:icon
        v-if="selected"
        src="check"
        class="text-blue-500"
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
          class="group-hover:bg-white group-hover:text-blue-500 hover:bg-blue-500 hover:text-white hover:ring-3
            hover:ring-white"
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

const moreMenuActions: object[] = [
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
