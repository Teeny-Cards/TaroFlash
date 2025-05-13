<template>
  <teleport to="[alert-container]">
    <Transition
      enter-from-class="scale-90 opacity-0"
      enter-to-class="scale-100 opacity-100"
      enter-active-class="transition-all transform"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-90 opacity-0"
      leave-active-class="transition-all transform"
    >
      <div
        ui-kit-alert
        v-if="open"
        class="pointer-events-auto fixed inset-0 flex items-center justify-center px-4 py-7"
        @click="close"
      >
        <div class="rounded-12 shadow-modal flex flex-col items-center gap-8 bg-white px-8 py-8">
          <h1 class="font-primary text-grey-dark text-center text-2xl font-semibold">
            {{ title }}
          </h1>
          <p class="font-primary text-grey text-center text-lg">{{ message }}</p>
          <div class="flex w-full justify-center gap-2.5">
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

  if (target.hasAttribute('ui-kit-alert')) {
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
