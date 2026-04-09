<script setup lang="ts">
import { onUnmounted, watchEffect, computed, onMounted, useTemplateRef } from 'vue'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { useModal } from '@/composables/modal'
import { useMediaQuery } from '@/composables/use-media-query'
import { useShortcuts } from '@/composables/use-shortcuts'
import { gsap } from 'gsap'

const { modal_stack, pop } = useModal()
const is_desktop_size = useMediaQuery('sm')
const shortcuts = useShortcuts('modal')

const modal_container = useTemplateRef<{ $el: HTMLElement }>('modal_container')

onMounted(() => {
  shortcuts.register({ combo: 'esc', handler: () => pop() })
})

onUnmounted(() => {
  shortcuts.dispose()
  if (modal_container.value?.$el) enableBodyScroll(modal_container.value.$el)
})

watchEffect(() => {
  if (!modal_container.value?.$el) return

  if (modal_stack.value.length > 0) {
    disableBodyScroll(modal_container.value.$el, { reserveScrollBarGap: true })
  } else {
    enableBodyScroll(modal_container.value.$el)
  }
})

const show_backdrop = computed(() => {
  return modal_stack.value.some((m) => m.backdrop)
})

function onEnter(el: Element, done: () => void) {
  if (is_desktop_size.value) {
    gsap.fromTo(
      el,
      { translateY: '200px', opacity: 0 },
      { translateY: 0, opacity: 1, duration: 0.2, ease: 'expo.out', onComplete: done }
    )
  } else {
    gsap.fromTo(
      el,
      { translateY: '100%' },
      { translateY: 0, duration: 0.2, ease: 'expo.out', onComplete: done }
    )
  }
}

function onLeave(el: Element, done: () => void) {
  if (is_desktop_size.value) {
    gsap.to(el, {
      translateY: '200px',
      opacity: 0,
      duration: 0.2,
      ease: 'expo.out',
      onComplete: done
    })
  } else {
    gsap.to(el, { translateY: '100%', duration: 0.2, ease: 'expo.out', onComplete: done })
  }
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
      @click="pop"
    >
      <slot></slot>
    </div>
  </transition>

  <transition-group
    @enter="onEnter"
    @leave="onLeave"
    data-testid="ui-kit-modal-container"
    ref="modal_container"
    tag="div"
    class="pointer-events-none fixed inset-0 z-90 flex items-end pt-4 sm:pt-0 sm:items-center justify-center *:pointer-events-auto"
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
