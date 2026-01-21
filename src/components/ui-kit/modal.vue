<script setup lang="ts">
import { onUnmounted, watchEffect, computed, onMounted, ref } from 'vue'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { useModal } from '@/composables/modal'
import { useMediaQuery } from '@/composables/use-media-query'

const { modal_stack, pop } = useModal()
const modal_container = ref<HTMLElement | null>(null)
const is_mobile = useMediaQuery('coarse')

onMounted(() => {
  modal_container.value = document.querySelector('[data-testid="ui-kit-modal-container"]')
})

onUnmounted(() => {
  if (!modal_container.value) return
  enableBodyScroll(modal_container.value)
})

watchEffect(() => {
  if (!modal_container.value || is_mobile.value) return

  if (modal_stack.value.length > 0) {
    disableBodyScroll(modal_container.value, { reserveScrollBarGap: true })
  } else {
    enableBodyScroll(modal_container.value)
  }
})

const show_backdrop = computed(() => {
  return modal_stack.value.some((m) => m.backdrop)
})
</script>

<template>
  <transition
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    enter-active-class="transition-[opacity] ease-in-out duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    leave-active-class="transition-[opacity] ease-in-out duration-100"
  >
    <div
      v-if="modal_stack.length > 0"
      data-testid="ui-kit-modal-backdrop"
      ref="ui-kit-modal"
      class="pointer-events-auto fixed inset-0 flex items-center justify-center px-4 py-7"
      :class="{ 'pointer-fine:backdrop-blur-4 pointer-fine:bg-black/10': show_backdrop }"
      @click="pop"
    >
      <slot></slot>
    </div>
  </transition>

  <transition-group
    data-testid="ui-kit-modal-container"
    tag="div"
    class="pointer-events-none fixed inset-0 z-90 flex items-center justify-center
      *:pointer-events-auto"
    enter-from-class="scale-90 opacity-0"
    enter-to-class="scale-100 opacity-100"
    enter-active-class="transition-[all] ease-in-out duration-100"
    leave-from-class="scale-100 opacity-100"
    leave-to-class="scale-90 opacity-0"
    leave-active-class="transition-[all] ease-in-out duration-100"
  >
    <component
      v-for="modal in modal_stack"
      :key="modal.id"
      :is="modal.component"
      v-bind="modal.componentProps"
      class="absolute"
    />
  </transition-group>
</template>
