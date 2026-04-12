<script setup lang="ts">
import { onUnmounted, watchEffect, computed, useTemplateRef } from 'vue'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { useModal, request_close_handlers, type ModalMode } from '@/composables/modal'
import { useMediaQuery } from '@/composables/use-media-query'
import { useShortcuts } from '@/composables/use-shortcuts'
import { MODAL_MODE_CONFIG } from './modal-mode-config'
import ModalSlot from './modal-slot.vue'

const DEFAULT_MODE: ModalMode = 'dialog'

const { modal_stack, pop } = useModal()
const is_desktop_size = useMediaQuery('sm')
const shortcuts = useShortcuts('modal')

const modal_container = useTemplateRef<{ $el: HTMLElement }>('modal_container')

function requestClose() {
  const top = modal_stack.value.at(-1)
  if (!top) return

  const handler = request_close_handlers.get(top.id)
  if (handler) {
    handler()
  } else {
    pop()
  }
}

onUnmounted(() => {
  shortcuts.dispose()
  if (modal_container.value?.$el) enableBodyScroll(modal_container.value.$el)
})

watchEffect(() => {
  if (!modal_container.value?.$el) return

  if (modal_stack.value.length > 0) {
    disableBodyScroll(modal_container.value.$el)
    shortcuts.register({ combo: 'esc', handler: requestClose })
  } else {
    enableBodyScroll(modal_container.value.$el)
    shortcuts.clearScope()
  }
})

const show_backdrop = computed(() => modal_stack.value.some((m) => m.backdrop))

function getElementMode(el: Element): ModalMode {
  return ((el as HTMLElement).dataset.modalMode as ModalMode) ?? DEFAULT_MODE
}

function getModeConfig(el: Element) {
  const mode = getElementMode(el)
  return MODAL_MODE_CONFIG[mode]
}

function onEnter(el: Element, done: () => void) {
  const config = getModeConfig(el)
  config.enter(el, is_desktop_size.value, done)
}

function onLeave(el: Element, done: () => void) {
  const config = getModeConfig(el)
  config.leave(el, is_desktop_size.value, done)
}
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
      class="pointer-events-auto fixed inset-0 flex items-center justify-center px-4 py-7"
      :class="{ 'pointer-fine:backdrop-blur-4 pointer-fine:bg-black/10': show_backdrop }"
      @click="requestClose"
    >
      <slot></slot>
    </div>
  </transition>

  <transition-group
    :css="false"
    @enter="onEnter"
    @leave="onLeave"
    data-testid="ui-kit-modal-container"
    :data-modal-mode="modal_stack.at(-1)?.mode ?? DEFAULT_MODE"
    ref="modal_container"
    tag="div"
    class="pointer-events-none fixed inset-0 z-90"
  >
    <div
      v-for="modal in modal_stack"
      :key="modal.id"
      class="absolute inset-0 flex justify-center pointer-events-none"
      :class="MODAL_MODE_CONFIG[modal.mode].containerClass"
      :data-modal-mode="modal.mode"
    >
      <modal-slot :id="modal.id" :context="modal.context">
        <component
          :is="modal.component"
          v-bind="modal.componentProps"
          :data-modal-mode="modal.mode"
          class="pointer-events-auto"
        />
      </modal-slot>
    </div>
  </transition-group>
</template>
