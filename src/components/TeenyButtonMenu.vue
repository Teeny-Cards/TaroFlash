<template>
  <div teeny-dropdown class="relative" ref="teenyDropdown">
    <slot
      teeny-dropdown__trigger
      name="trigger"
      :toggleDropdown="toggleDropdown"
      :open="dropdownVisible"
    >
      <TeenyButton
        teeny-dropdown-trigger
        :variant="variant"
        :inverted="inverted"
        @click="toggleDropdown"
      />
    </slot>
    <div v-if="dropdownVisible" class="absolute z-10 right-0 top-full mt-2">
      <slot name="dropdown">
        <div class="flex flex-col gap-1.5 items-end">
          <TeenyButton
            v-for="action in actions"
            teeny-dropdown__action
            class="shadow opacity-0 transition-all duration-100 transform scale-75"
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
import { nextTick } from 'vue'

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

async function toggleDropdown(): Promise<void> {
  if (dropdownVisible.value) {
    const nodeList = teenyDropdown.value?.querySelectorAll('[teeny-dropdown__action]')
    const actions = nodeList ? [...nodeList] : []

    await animateActionsOut(actions, 25)
    dropdownVisible.value = false
  } else {
    dropdownVisible.value = true
    await nextTick()

    const nodeList = teenyDropdown.value?.querySelectorAll('[teeny-dropdown__action]')
    const actions = nodeList ? [...nodeList] : []
    animateActionsIn(actions, 25)
  }
}

function closeDropdown(e: MouseEvent): void {
  const clickedElement = e.target as Node

  if (!teenyDropdown.value?.contains(clickedElement)) {
    dropdownVisible.value = false
  }
}

function animateActionsIn(elements: Element[], delay: number): void {
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.remove('opacity-0')
      element.classList.remove('scale-75')
    }, delay * index)
  })
}

function animateActionsOut(elements: Element[], delay: number): Promise<void> {
  return new Promise((resolve) => {
    for (let i = elements.length - 1; i >= 0; i--) {
      setTimeout(
        () => {
          elements[i].classList.add('opacity-0')
          elements[i].classList.add('scale-75')

          // Resolve the promise when the last element has received the class
          if (i === 0) {
            setTimeout(resolve, 200)
          }
        },
        delay * (elements.length - i)
      )
    }
  })
}
</script>
