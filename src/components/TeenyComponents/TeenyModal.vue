<template>
  <teleport to="[teeny-modal-container]">
    <Transition
      enter-from-class="scale-90 opacity-0"
      enter-to-class="scale-100 opacity-100"
      enter-active-class="transition-all transform"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-90 opacity-0"
      leave-active-class="transition-all transform"
    >
      <div
        teeny-modal
        v-if="open"
        class="fixed inset-0 flex items-center justify-center px-4 pointer-events-auto py-7"
        @click="close"
      >
        <slot></slot>
      </div>
    </Transition>
  </teleport>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'

const emit = defineEmits<{ (event: 'close'): void }>()

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const scrollTop = ref(document.documentElement.scrollTop)
const released = ref(false)

onUnmounted(() => {
  releaseScroll()
})

function captureScroll(): void {
  scrollTop.value = document.documentElement.scrollTop
  document.body.style.position = 'fixed'
  document.body.style.top = `${-scrollTop.value}px`
  document.body.style.width = '100%'

  released.value = false
}

function releaseScroll(): void {
  if (released.value) return

  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  window.scrollTo(0, scrollTop.value)

  released.value = true
}

function close(e: Event) {
  const target = e.target as HTMLElement

  if (target.hasAttribute('teeny-modal')) {
    emit('close')
  }
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      captureScroll()
    } else {
      releaseScroll()
    }
  }
)
</script>
