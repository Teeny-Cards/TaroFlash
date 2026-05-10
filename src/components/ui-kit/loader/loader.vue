<script lang="ts" setup>
import UiImage from '@/components/ui-kit/image.vue'
import Burst from '@/components/ui-kit/burst.vue'
import { type LoaderPhase } from './index.vue'

type ScopedProps = {
  loadingImage: string
  doneImage?: string
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  theme?: Theme
  themeDark?: Theme
  burstDurationMs?: number
  phase: LoaderPhase
  is_dark_mode: boolean
}

const { burstDurationMs = 500 } = defineProps<ScopedProps>()
</script>

<template>
  <div
    class="ui-kit-loader bg-(--theme-primary)"
    :data-theme="is_dark_mode ? (themeDark ?? theme) : theme"
    :class="[
      `ui-kit-loader--${size}`,
      {
        'ui-kit-loader--loading': phase === 'loading'
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

    <burst v-if="phase !== 'loading'" :size="size" :duration="burstDurationMs" />
  </div>
</template>

<style>
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

.ui-kit-loader--loading .ui-kit-loader__image {
  animation: shake 1s ease-in-out infinite;
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
</style>
