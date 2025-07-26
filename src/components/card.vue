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
