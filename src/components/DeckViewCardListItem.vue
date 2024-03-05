<template>
  <div class="flex items-center gap-6">
    <TeenyCard size="xs" />
    {{ card.frontText }}
  </div>
  {{ card.backText }}
  <TeenyDropdown :actions="moreMenuActions">
    <template #trigger="{ toggleDropdown }">
      <div
        @click="toggleDropdown"
        class="w-6 h-6 rounded-full flex items-center justify-center bg-grey-light"
        tabindex="0"
        role="button"
      >
        <TeenyIcon src="more" size="teeny" />
      </div>
    </template>
  </TeenyDropdown>
</template>

<script setup lang="ts">
import TeenyCard from '@/components/TeenyCard.vue'
import TeenyIcon from '@/components/TeenyIcon.vue'
import TeenyDropdown, { type DropdownAction } from './TeenyDropdown.vue'
import type { PropType } from 'vue'

defineProps({
  card: {
    type: Object as PropType<Card>,
    required: true
  }
})

const moreMenuActions: DropdownAction[] = [
  {
    label: 'Select',
    action: () => console.log('Edit'),
    inverted: true,
    iconRight: 'check'
  },
  {
    label: 'Move',
    action: () => console.log('Delete'),
    inverted: true,
    iconRight: 'arrow-forward'
  },
  {
    label: 'Delete',
    action: () => console.log('Delete'),
    variant: 'danger',
    inverted: true,
    iconRight: 'delete'
  }
]
</script>
