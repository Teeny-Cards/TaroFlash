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
      <div v-if="image_url" class="card__image">
        <img :src="image_url" alt="Deck Image preview" class="h-full w-full object-cover" />
      </div>
      <slot name="back"></slot>
    </div>
  </transition>
</template>

<script setup lang="ts">
const { size = 'base' } = defineProps<{
  size?: 'large' | 'base' | 'small' | 'xs' | '2xs' | '3xs'
  revealed?: Boolean
  image_url?: string
}>()
</script>
