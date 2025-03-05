<template>
  <teleport to="[teeny-alert-container]">
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
        <div class="px-8 py-8 bg-white rounded-12 flex flex-col items-center gap-8 shadow-modal">
          <h1 class="text-2xl font-semibold font-primary text-grey-dark text-center">
            {{ title }}
          </h1>
          <p class="text-lg font-primary text-center text-grey">{{ message }}</p>
          <div class="w-full flex justify-center gap-2.5">
            <slot></slot>
          </div>
        </div>
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
  },
  title: String,
  message: String
})

onUnmounted(() => {
  releaseScroll()
})

const scrollTop = ref(document.documentElement.scrollTop)

function captureScroll(): void {
  scrollTop.value = document.documentElement.scrollTop
  document.body.style.position = 'fixed'
  document.body.style.top = `${-scrollTop.value}px`
  document.body.style.width = '100%'
}

function releaseScroll(): void {
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  window.scrollTo(0, scrollTop.value)
}

function close(e: Event) {
  const target = e.target as HTMLElement

  if (target.hasAttribute('teeny-modal')) {
    releaseScroll()
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
