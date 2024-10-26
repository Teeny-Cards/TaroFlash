<template>
  <div class="flex items-center gap-6" tabindex="0" role="button">
    <TeenyCard size="xs" />
    {{ card.frontText }}
  </div>
  {{ card.backText }}
  <TeenyButtonMenu :actions="moreMenuActions">
    <template #trigger="{ toggleDropdown }">
      <div
        @click="toggleDropdown"
        class="flex items-center justify-center w-6 h-6 rounded-full bg-grey-light"
        tabindex="0"
        role="button"
      >
        <TeenyIcon src="more" size="teeny" />
      </div>
    </template>
  </TeenyButtonMenu>
</template>

<script setup lang="ts">
import TeenyCard from '@teeny/TeenyCard.vue'
import TeenyIcon from '@teeny/TeenyIcon.vue'
import TeenyButtonMenu from '@teeny/TeenyButtonMenu.vue'
import type { PropType } from 'vue'

const props = defineProps({
  card: {
    type: Object as PropType<Card>,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'moveCard', card: Card): void
  (e: 'deleteCard', card: Card): void
}>()

const moreMenuActions: TeenyButton[] = [
  {
    label: 'Select',
    action: () => {},
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
