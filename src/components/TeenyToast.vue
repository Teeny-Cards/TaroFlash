<template>
  <transition
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    enter-active-class="transform transition-transform"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
    leave-active-class="transform transition-transform"
  >
    <div v-if="open" class="rounded-xl p-4 text-white shadow-lg w-72" :class="color">
      {{ toast.message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, type PropType, onMounted, computed } from 'vue'

const props = defineProps({
  toast: {
    type: Object as PropType<TeenyToast>,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'close', toast: TeenyToast): void
}>()

const open = ref(false)
const timeout = ref<NodeJS.Timeout>()

const color = computed(() => {
  switch (props.toast.state) {
    case 'info':
      return 'bg-blue-400'
    case 'warn':
      return 'bg-yellow-400'
    case 'error':
      return 'bg-red-400'
    default:
      return 'bg-green-400'
  }
})

onMounted(() => {
  openToast()
})

function openToast(): void {
  open.value = true
  if (props.toast.persist) return

  timeout.value = setTimeout(() => {
    closeToast()
  }, props.toast.delay)
}

function closeToast(): void {
  open.value = false

  setTimeout(() => {
    emit('close', props.toast)
  }, 1000) // Animation time
}
</script>
