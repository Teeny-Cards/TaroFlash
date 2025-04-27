<template>
  <teleport to="[modal-container]">
    <div
      v-if="backdrop && open"
      class="fixed inset-0 bg-black/25 pointer-events-auto backdrop-blur-xs"
    ></div>
    <Transition
      enter-from-class="scale-90 opacity-0"
      enter-to-class="scale-100 opacity-100"
      enter-active-class="transition-all transform"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-90 opacity-0"
      leave-active-class="transition-all transform"
    >
      <div
        ui-kit-modal
        v-if="open"
        ref="ui-kit-modal"
        class="fixed inset-0 flex items-center justify-center px-4 pointer-events-auto py-7"
        @click="close"
      >
        <slot></slot>
      </div>
    </Transition>
  </teleport>
</template>

<script setup lang="ts">
import { onUnmounted, watch, useTemplateRef, nextTick } from 'vue'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

const emit = defineEmits<{ (event: 'close'): void }>()

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  backdrop: Boolean
})

const modal = useTemplateRef<HTMLDivElement>('ui-kit-modal')

onUnmounted(() => {
  enableBodyScroll(modal.value)
})

function close(e: Event) {
  const target = e.target as HTMLElement

  if (target.hasAttribute('ui-kit-modal')) {
    emit('close')
  }
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      await nextTick()
      disableBodyScroll(modal.value, { reserveScrollBarGap: true })
    } else {
      enableBodyScroll(modal.value)
    }
  }
)
</script>
