<script setup lang="ts">
import { ref } from 'vue'

const { size = 'base' } = defineProps<{
  size?: 'large' | 'base' | 'small' | 'xs' | '2xs' | '3xs'
  revealed?: Boolean
  image_url?: string
}>()

const show_image = ref(true)

const icon_size: { [key: string]: string } = {
  large: '4xl',
  base: '2xl',
  small: 'large',
  xs: 'base',
  '2xs': 'small',
  '3xs': 'xs'
}

function onImageError() {
  show_image.value = false
}
</script>

<template>
  <transition
    mode="out-in"
    enter-from-class="motion-safe:rotate-y-90 -translate-y-6"
    enter-to-class="motion-safe:rotate-y-0"
    enter-active-class="transition-[all] ease-in-out duration-150"
    leave-from-class="motion-safe:rotate-y-0"
    leave-to-class="motion-safe:rotate-y-90 -translate-y-6"
    leave-active-class="motion-safe:transition-[all] ease-in-out duration-150"
  >
    <div v-if="revealed" data-testid="card" class="card card--revealed" :class="`card--${size}`">
      <slot></slot>
    </div>
    <div v-else data-testid="card" class="card card--hidden" :class="`card--${size}`">
      <div v-if="image_url && show_image" class="card__image">
        <img
          :src="image_url"
          alt="Deck Image preview"
          class="h-full w-full object-cover"
          @error="onImageError"
        />
      </div>
      <div v-else class="flex h-full w-full items-center justify-center">
        <ui-kit:icon src="teeny-cards" :size="icon_size[size]" class="text-brown-300" />
      </div>

      <slot name="back"></slot>
    </div>
  </transition>
</template>

<style>
@reference '@/styles/main.css';

.card {
  @apply aspect-card border-brown-300 shrink-0 p-3;
}

.card.card--revealed {
  @apply flex items-center justify-center bg-white;
}

.card.card--hidden {
  @apply relative bg-purple-400 bg-(image:--diagonal-stripes);
}

.card.card--large {
  @apply rounded-14 max-w-65 min-w-65 border-8 text-3xl;
}

.card.card--base {
  @apply rounded-10 max-w-48 min-w-48 border-6 text-2xl;
}

.card.card--small {
  @apply rounded-8 max-w-34.5 min-w-34.5 border-6 text-lg;
}

.card.card--xs {
  @apply rounded-6 max-w-25.5 min-w-25.5 text-base;
}

.card.card--2xs {
  @apply rounded-3.5 max-w-10.75 min-w-10.75 border-3 text-sm;
}

.card.card--3xs {
  @apply rounded-2 max-w-7 min-w-7 text-sm;
}

.card__image {
  @apply absolute inset-0 overflow-hidden;
}

/* TUNED*/
.card--large .card__image {
  border-radius: 48px;
}

.card--base .card__image {
  border-radius: 32px;
}

.card--small .card__image {
  border-radius: 26px;
}

/* NEEDS TUNING */
.card--xs .card__image {
  border-radius: 20.5px;
}

.card--2xs .card__image {
  border-radius: 12.5px;
}

.card--3xs .card__image {
  border-radius: 8.5px;
}
</style>
