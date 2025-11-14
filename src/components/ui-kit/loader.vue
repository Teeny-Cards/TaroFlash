<script lang="ts" setup>
import UiImage from '@/components/ui-kit/image.vue'

const {
  image,
  size = 'base',
  theme = 'green'
} = defineProps<{
  image: string
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  theme?: 'green' | 'blue' | 'purple' | 'pink' | 'red' | 'orange' | 'brown' | 'grey'
}>()
</script>

<template>
  <div class="ui-kit-loader" :class="`ui-kit-loader--${theme} ui-kit-loader--${size}`">
    <ui-image :src="image" :size="size" />
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

  <div class="contents">
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

.ui-kit-loader {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--theme);
  position: relative;
}
.ui-kit-loader--green {
  --theme: var(--color-green-400);
}
.ui-kit-loader--blue {
  --theme: var(--color-blue-500);
}
.ui-kit-loader--purple {
  --theme: var(--color-purple-400);
}
.ui-kit-loader--pink {
  --theme: var(--color-pink-500);
}
.ui-kit-loader--red {
  --theme: var(--color-red-500);
}
.ui-kit-loader--orange {
  --theme: var(--color-orange-500);
}
.ui-kit-loader--brown {
  --theme: var(--color-brown-100);
}
.ui-kit-loader--grey {
  --theme: var(--color-grey-400);
}

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
  --dur: 500ms;

  --spoke-min: var(--dot-size);
  --spoke-max: 25px;

  animation: burstProgress var(--dur) ease-out infinite;

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

  /* Anchor at center for phase 1 (grow outward from center) */
  transform-origin: 50% 0%;
  translate: calc(-0.5 * var(--dot-size)) 0;

  /* Push the base of the spoke out to current radius */
  transform: translateY(var(--radius));
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
