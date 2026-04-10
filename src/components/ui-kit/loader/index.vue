<script setup lang="ts">
import Loader from './loader.vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { emitSfx } from '@/sfx/bus'
import { useTheme } from '@/composables/use-theme'

type LoaderSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'
export type LoaderPhase = 'loading' | 'finishing' | 'done'

export type LoaderProps = {
  loadingImage: string
  doneImage?: string
  size?: LoaderSize
  theme?: MemberTheme
  themeDark?: MemberTheme
  loading?: boolean
  burstDurationMs?: number
  fadeMs?: number
  delayMs?: number
  immediate?: boolean
  keepAlive?: boolean
}

const {
  loadingImage,
  doneImage,
  size = 'base',
  theme = 'blue-500',
  themeDark,
  loading,
  burstDurationMs = 500,
  fadeMs = 120,
  delayMs = 200,
  immediate = false
} = defineProps<LoaderProps>()

const emit = defineEmits<{
  (e: 'finish'): void
}>()

const { is_dark } = useTheme()

const phase = ref<LoaderPhase>(!loading && immediate ? 'done' : 'loading')

const showLoader = computed(() => phase.value !== 'done')
let finishTimer: number | null = null

onMounted(() => {
  document.documentElement.style.setProperty('--fade-ms', `${fadeMs}ms`)
})

function clearFinishTimer() {
  if (finishTimer != null) {
    window.clearTimeout(finishTimer)
    finishTimer = null
  }
}

async function startFinishSequence() {
  await new Promise((resolve) => setTimeout(resolve, delayMs))

  clearFinishTimer()
  phase.value = 'finishing'
  emitSfx('ui.negative_pop')

  finishTimer = window.setTimeout(() => {
    phase.value = 'done'
    finishTimer = null
    emit('finish')
  }, burstDurationMs)
}

watch(
  () => loading,
  (isLoading) => {
    if (isLoading) {
      clearFinishTimer()
      phase.value = 'loading'
      return
    }
    if (phase.value !== 'done') startFinishSequence()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  clearFinishTimer()
})

defineExpose({ phase })
</script>

<template>
  <loader
    v-if="showLoader"
    :loading-image="loadingImage"
    :done-image="doneImage"
    :size="size"
    :theme="theme"
    :theme-dark="themeDark"
    :burst-duration-ms="burstDurationMs"
    :phase="phase"
    :is_dark_mode="is_dark"
  >
  </loader>

  <div v-else class="contents">
    <slot></slot>
  </div>
</template>
