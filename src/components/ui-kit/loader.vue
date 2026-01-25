<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import UiImage from '@/components/ui-kit/image.vue'
import { emitSfx } from '@/sfx/bus'
import { useMediaQuery } from '@/composables/use-media-query'

type LoaderSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'

const {
  size = 'base',
  theme = 'green',
  themeDark,
  burstDurationMs = 500,
  fadeMs = 120,
  loading,
  immediate = false,
  loadingImage,
  doneImage,
  delayMs = 200,
  keepAlive = false
} = defineProps<{
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
}>()

defineOptions({
  inheritAttrs: false
})

const emit = defineEmits<{
  (e: 'finish'): void
}>()

const slots = defineSlots<{
  default(): any
}>()

const is_dark_mode = useMediaQuery('dark')

const phase = ref<'loading' | 'finishing' | 'done'>(!loading && immediate ? 'done' : 'loading')

const showLoader = computed(() => phase.value !== 'done')

let finishTimer: number | null = null

onMounted(() => {
  document.documentElement.style.setProperty('--burst-dur', `${burstDurationMs}ms`)
  document.documentElement.style.setProperty('--fade-ms', `${fadeMs}ms`)

  console.log(slots.default())
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
</script>

<template>
  <div
    v-if="showLoader"
    v-bind="$attrs"
    class="ui-kit-loader bg-(--theme-primary)"
    :data-theme="is_dark_mode ? (themeDark ?? theme) : theme"
    :class="[
      `ui-kit-loader--${size}`,
      {
        'ui-kit-loader--loading': phase === 'loading',
        'ui-kit-loader--keep-alive': keepAlive
      }
    ]"
  >
    <ui-image
      v-if="phase === 'loading'"
      :src="loadingImage"
      :size="size"
      class="ui-kit-loader__image"
    />
    <ui-image v-else :src="doneImage ?? loadingImage" :size="size" class="ui-kit-loader__image" />

    <div class="burst">
      <div class="spoke" style="--i: 0"><span class="dot"></span></div>
      <div class="spoke" style="--i: 1"><span class="dot"></span></div>
      <div class="spoke" style="--i: 2"><span class="dot"></span></div>
      <div class="spoke" style="--i: 3"><span class="dot"></span></div>
      <div class="spoke" style="--i: 4"><span class="dot"></span></div>
      <div class="spoke" style="--i: 5"><span class="dot"></span></div>
      <div class="spoke" style="--i: 6"><span class="dot"></span></div>
      <div class="spoke" style="--i: 7"><span class="dot"></span></div>
    </div>
  </div>

  <div v-if="!showLoader || keepAlive" class="contents">
    <slot></slot>
  </div>
</template>

<style>
@property --p {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}
@property --radius {
  syntax: '<length>';
  inherits: true;
  initial-value: 0px;
}
@property --spoke-length {
  syntax: '<length>';
  inherits: true;
  initial-value: 0px;
}

/* quick fade for content */
.ui-kit-loader-fade-enter-active,
.ui-kit-loader-fade-leave-active {
  transition: opacity var(--fade-ms, 120ms) ease;
}
.ui-kit-loader-fade-enter-from,
.ui-kit-loader-fade-leave-to {
  opacity: 0;
}

.ui-kit-loader {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  z-index: 1000;
}

.ui-kit-loader--keep-alive {
  position: absolute;
  inset: 0;
}

.ui-kit-loader--loading .burst {
  display: none;
}
.ui-kit-loader--loading .ui-kit-loader__image {
  animation: shake 1s ease-in-out infinite;
}

/* sizes (controls burst radius) */
.ui-kit-loader--xs {
  --radius-start: 10px;
  --radius-end: 20px;
}
.ui-kit-loader--sm {
  --radius-start: 20px;
  --radius-end: 40px;
}
.ui-kit-loader--base {
  --radius-start: 30px;
  --radius-end: 50px;
}
.ui-kit-loader--lg {
  --radius-start: 40px;
  --radius-end: 80px;
}
.ui-kit-loader--xl {
  --radius-start: 80px;
  --radius-end: 160px;
}

.burst {
  --n: 8;
  --dot-size: 6px;

  --spoke-min: var(--dot-size);
  --spoke-max: 25px;

  animation: burstProgress var(--burst-dur) ease-out forwards;

  --radius: calc(var(--radius-start) + (var(--radius-end) - var(--radius-start)) * var(--p));
  --tri: min(calc(2 * var(--p)), calc(2 - 2 * var(--p)));
  --spoke-length: calc(var(--spoke-min) + (var(--spoke-max) - var(--spoke-min)) * var(--tri));

  position: absolute;
  width: calc(var(--radius) * 2);
  height: calc(var(--radius) * 2);
}

.burst::before {
  content: '';
  position: absolute;
  inset: 0;
  transform: translate(-50%, -50%);
}

.burst .spoke {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  transform: rotate(calc(360deg * var(--i) / var(--n)));
  transform-origin: 0 0;
}

.burst .dot {
  position: absolute;
  left: 0;
  top: 0;

  width: var(--dot-size);
  height: var(--spoke-length);

  background: white;
  border-radius: 9999px;

  transform-origin: 50% 0%;
  translate: calc(-0.5 * var(--dot-size)) 0;
  transform: translateY(var(--radius));
}

@keyframes shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

@keyframes burstProgress {
  0% {
    --p: 0;
  }
  50% {
    --p: 1;
  }
  100% {
    --p: 1;
  }
}
</style>
