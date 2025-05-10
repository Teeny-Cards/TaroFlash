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
        class="backdrop-blur-4 pointer-events-auto fixed inset-0 bg-black/25"
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
        class="pointer-events-auto fixed inset-0 flex items-center justify-center px-4 py-7"
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
import { onMounted } from 'vue'

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'opened'): void
}>()

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  backdrop: Boolean
})

const modal = useTemplateRef<HTMLDivElement>('ui-kit-modal')

onMounted(async () => {
  if (props.open) {
    await nextTick()
    if (!modal.value) return
    disableBodyScroll(modal.value, { reserveScrollBarGap: true })
  }
})

onUnmounted(() => {
  if (!modal.value) return
  enableBodyScroll(modal.value)
})

function close(e: Event) {
  const target = e.target as HTMLElement

  if (target.hasAttribute('data-testid') && target.getAttribute('data-testid') === 'ui-kit-modal') {
    emit('close')
  }
}

watch(
  () => props.open,
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
