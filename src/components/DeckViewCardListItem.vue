<template>
  <div
    class="hover:font-bold group px-4 py-2 w-full flex items-center justify-between cursor-pointer hover:bg-[url('../assets/svg/stripe-blue.svg')] rounded-[28px]"
  >
    <div class="flex items-center gap-6 group-hover:text-white" tabindex="0" role="button">
      <TeenyCard size="xs" />
      {{ card.frontText }}
    </div>
    <span class="group-hover:text-white">{{ card.backText }}</span>
    <TeenyButtonMenu :actions="moreMenuActions">
      <template #trigger="{ toggleDropdown }">
        <TeenyButton
          @click="toggleDropdown"
          icon-only
          variant="muted"
          icon-right="more"
          size="small"
          class="group-hover:bg-white group-hover:text-blue!"
        />
      </template>
    </TeenyButtonMenu>
  </div>
</template>

<script setup lang="ts">
import TeenyCard from '@teeny/TeenyCard.vue'
import TeenyButton from '@teeny/TeenyButton.vue'
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
