<template>
  <div data-testid="ui-kit-button-menu" class="relative w-max" ref="teenyDropdown">
    <slot name="trigger" :toggleDropdown="toggleDropdown" :open="dropdownVisible">
      <ui-button :variant="variant" :inverted="inverted" @click="toggleDropdown">
        {{ triggerLabel }}
      </ui-button>
    </slot>
    <div
      v-if="dropdownVisible"
      data-testid="ui-kit-button-menu__dropdown"
      class="absolute top-full right-0 z-10 mt-2 lg:left-0"
    >
      <slot name="dropdown" :closeDropdown="closeDropdown">
        <div class="flex flex-col items-end gap-1.5 lg:items-start">
          <ui-button
            v-for="action in actions"
            data-testid="button-menu__action"
            :data-action="action.label"
            class="scale-75 transform opacity-0 shadow transition-all duration-100"
            :key="action.label"
            :variant="action.variant"
            :inverted="action.inverted"
            :iconLeft="action.iconLeft"
            :iconRight="action.iconRight"
            :iconOnly="action.iconOnly"
            :size="action.size"
            @click="onOptionClick(action)"
          >
            {{ action.label }}
          </ui-button>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { onMounted } from 'vue'
import { nextTick } from 'vue'
import UiButton from '@/components/ui-kit/button.vue'

defineProps({
  triggerLabel: String,
  variant: String,
  inverted: Boolean,
  actions: Array<any>
})

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

const teenyDropdown = ref<HTMLDivElement>()
const dropdownVisible = ref(false)

function onOptionClick(action: any): void {
  action.action()
  closeDropdown()
}

async function toggleDropdown(e: Event): Promise<void> {
  e.stopPropagation()

  if (dropdownVisible.value) {
    const nodeList = teenyDropdown.value?.querySelectorAll('[data-testid="button-menu__action"]')
    const actions = nodeList ? [...nodeList] : []

    await animateActionsOut(actions, 25)
    dropdownVisible.value = false
  } else {
    dropdownVisible.value = true
    await nextTick()

    const nodeList = teenyDropdown.value?.querySelectorAll('[data-testid="button-menu__action"]')
    const actions = nodeList ? [...nodeList] : []
    animateActionsIn(actions, 25)
  }
}

function closeDropdown(): void {
  dropdownVisible.value = false
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
