<script setup lang="ts">
import { onUnmounted, useTemplateRef, watchEffect } from 'vue'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { useModal } from '@/composables/use-modal'

const { closeOnBackdropClick = true } = defineProps({
  backdrop: Boolean,
  closeOnBackdropClick: Boolean
})

const { modalStack, closeModal } = useModal()
const modal = useTemplateRef<HTMLDivElement>('ui-kit-modal-stack')

onUnmounted(() => {
  if (!modal.value) return
  enableBodyScroll(modal.value)
})

function close(e: Event) {
  const target = e.target as HTMLElement

  if (closeOnBackdropClick && target.dataset.testid === 'ui-kit-modal-backdrop') {
    closeModal()
  }
}

watchEffect(() => {
  if (!modal.value) return

  if (modalStack.value.length > 0) {
    disableBodyScroll(modal.value, { reserveScrollBarGap: true })
  } else {
    enableBodyScroll(modal.value)
  }
})
</script>

<template>
  <transition
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    enter-active-class="transition-[opacity] ease-in-out duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    leave-active-class="transition-[opacity] ease-in-out duration-150"
  >
    <div
      v-if="modalStack.length > 0"
      data-testid="ui-kit-modal-backdrop"
      ref="ui-kit-modal"
      class="pointer-events-auto fixed inset-0 flex items-center justify-center px-4 py-7"
      :class="{ 'backdrop-blur-4 bg-black/25': backdrop }"
      @click="close"
    >
      <slot></slot>
    </div>
  </transition>

  <transition-group
    data-testid="ui-kit-modal-stack"
    tag="div"
    class="pointer-events-none fixed inset-0 z-20 flex items-center justify-center *:pointer-events-auto"
    enter-from-class="scale-90 opacity-0"
    enter-to-class="scale-100 opacity-100"
    enter-active-class="transition-[all] ease-in-out duration-150"
    leave-from-class="scale-100 opacity-100"
    leave-to-class="scale-90 opacity-0"
    leave-active-class="transition-[all] ease-in-out duration-150"
  >
    <div
      v-for="modal in modalStack"
      :key="modal.id"
      :backdrop="modal.backdrop"
      :close-on-backdrop-click="modal.closeOnBackdropClick"
      @closed="() => closeModal(modal.id)"
    >
      <component :is="modal.component" v-bind="modal.componentProps" />
    </div>
  </transition-group>
</template>
