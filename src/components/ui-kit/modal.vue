<script setup lang="ts">
import { onUnmounted, watch, useTemplateRef, nextTick } from 'vue'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { onMounted } from 'vue'

const emit = defineEmits<{
  (event: 'closed'): void
  (event: 'opened'): void
}>()

const {
  open = false,
  backdrop = true,
  closeOnBackdropClick = true
} = defineProps({
  open: Boolean,
  backdrop: Boolean,
  closeOnBackdropClick: Boolean
})

const modal = useTemplateRef<HTMLDivElement>('ui-kit-modal')

onMounted(async () => {
  if (open) {
    await nextTick()
    if (!modal.value) return
    disableBodyScroll(modal.value, { reserveScrollBarGap: true })
    emit('opened')
  }
})

onUnmounted(() => {
  if (!modal.value) return
  enableBodyScroll(modal.value)
})

function close(e: Event) {
  const target = e.target as HTMLElement

  if (
    closeOnBackdropClick &&
    target.dataset.testid &&
    target.dataset.testid === 'ui-kit-modal-backdrop'
  ) {
    emit('closed')
  }
}

watch(
  () => open,
  async (open) => {
    if (open) {
      emit('opened')
      await nextTick()

      if (!modal.value) return
      disableBodyScroll(modal.value, { reserveScrollBarGap: true })
    } else {
      if (!modal.value) return
      enableBodyScroll(modal.value)
    }
  }
)
</script>

<template>
  <teleport to="[modal-container]">
    <Transition
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      enter-active-class="transition-[opacity] ease-in-out duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      leave-active-class="transition-[opacity] ease-in-out duration-150"
    >
      <div
        v-if="backdrop && open"
        data-testid="ui-kit-modal-backdrop"
        class="backdrop-blur-4 pointer-events-auto fixed inset-0 bg-black/25"
        @click="close"
      ></div>
    </Transition>
    <Transition
      enter-from-class="scale-90 opacity-0"
      enter-to-class="scale-100 opacity-100"
      enter-active-class="transition-[all] ease-in-out duration-150"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-90 opacity-0"
      leave-active-class="transition-[all] ease-in-out duration-150"
    >
      <div
        data-testid="ui-kit-modal"
        v-if="open"
        ref="ui-kit-modal"
        class="fixed inset-0 flex items-center justify-center px-4 py-7 *:pointer-events-auto"
      >
        <slot></slot>
      </div>
    </Transition>
  </teleport>
</template>
