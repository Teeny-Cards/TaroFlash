<template>
  <div class="relative" ref="teenyDropdown">
    <slot name="trigger" :toggleDropdown="toggleDropdown" :open="dropdownVisible">
      <TeenyButton :variant="variant" :inverted="inverted" @click="toggleDropdown" />
    </slot>
    <div v-if="dropdownVisible" class="absolute z-10 right-0 top-full mt-2">
      <slot name="dropdown">
        <div class="flex flex-col gap-1.5 items-end">
          <TeenyButton
            v-for="action in actions"
            class="shadow"
            :key="action.label"
            :variant="action.variant"
            :inverted="action.inverted"
            :iconLeft="action.iconLeft"
            :iconRight="action.iconRight"
            :iconOnly="action.iconOnly"
            :size="action.size"
            @click="action.action"
          >
            {{ action.label }}
          </TeenyButton>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import TeenyButton from '@/components/TeenyButton.vue'
import { onUnmounted, ref } from 'vue'
import { onMounted } from 'vue'

export interface DropdownAction {
  label: string
  action: () => void
  variant?: string
  inverted?: boolean
  iconLeft?: string
  iconRight?: string
  iconOnly?: boolean
  size?: string
}

defineProps({
  variant: String,
  inverted: Boolean,
  actions: Array<DropdownAction>
})

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

const teenyDropdown = ref<HTMLDivElement>()
const dropdownVisible = ref(false)

function toggleDropdown(): void {
  dropdownVisible.value = !dropdownVisible.value
}

function closeDropdown(e: MouseEvent): void {
  const clickedElement = e.target as Node

  if (!teenyDropdown.value?.contains(clickedElement)) {
    dropdownVisible.value = false
  }
}
</script>
