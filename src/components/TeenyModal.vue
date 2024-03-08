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
const emit = defineEmits<{ (event: 'close'): void }>()

defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

function close(e: Event) {
  const target = e.target as HTMLElement

  if (target.hasAttribute('teeny-modal')) {
    emit('close')
  }
}
</script>
