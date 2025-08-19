<script setup lang="ts">
import CardFace from './card-face.vue'

const {
  size = 'base',
  front_image_url,
  back_image_url,
  side = 'front',
  mode = 'view'
} = defineProps<{
  size?: 'lg' | 'base' | 'sm' | 'xs' | '2xs' | '3xs'
  mode?: 'view' | 'edit' | 'select'
  side?: 'front' | 'back'
  front_image_url?: string
  front_text?: string
  back_image_url?: string
  back_text?: string
}>()
</script>

<template>
  <div class="card-container" :class="`card-container--${size} card-container--${mode}`">
    <slot></slot>

    <transition
      mode="out-in"
      enter-from-class="motion-safe:rotate-y-90 -translate-y-6"
      enter-to-class="motion-safe:rotate-y-0"
      enter-active-class="transition-[all] ease-in-out duration-150"
      leave-from-class="motion-safe:rotate-y-0"
      leave-to-class="motion-safe:rotate-y-90 -translate-y-6"
      leave-active-class="motion-safe:transition-[all] ease-in-out duration-150"
    >
      <card-face
        v-if="side === 'front'"
        data-testid="card-face__front"
        :image="front_image_url"
        :text="front_text"
        :mode="mode"
      />

      <card-face
        v-else
        data-testid="card-face__back"
        :image="back_image_url"
        :text="back_text"
        :mode="mode"
      />
    </transition>
  </div>
</template>

<style>
.card-container {
  aspect-ratio: var(--aspect-card);
  position: relative;
  width: var(--card-width);
  transition: width 0.05s ease-in-out;
}

.card-container--lg {
  --card-width: 260px;
  --face-border-width: 8px;
  --face-radius: 56px;
  --face-padding: 12px;
  --face-text-size: var(--text-lg);
  --face-text-size--line-height: var(--text-lg--line-height);
}
.card-container--base {
  --card-width: 192px;
  --face-border-width: 6px;
  --face-radius: 40px;
  --face-padding: 8px;
  --face-text-size: var(--text-base);
  --face-text-size--line-height: var(--text-base--line-height);
}
.card-container--sm {
  --card-width: 138px;
  --face-border-width: 6px;
  --face-radius: 32px;
  --face-padding: 6px;
  --face-text-size: var(--text-sm);
  --face-text-size--line-height: var(--text-sm--line-height);
}
.card-container--xs {
  --card-width: 102px;
  --face-border-width: 4px;
  --face-radius: 24px;
  --face-padding: 4px;
  --face-text-size: var(--text-sm);
  --face-text-size--line-height: var(--text-sm--line-height);
}
.card-container--2xs {
  --card-width: 43px;
  --face-border-width: 3px;
  --face-radius: 14px;
  --face-padding: 2px;
  --face-text-size: var(--text-xs);
  --face-text-size--line-height: var(--text-xs--line-height);
}
.card-container--3xs {
  --card-width: 28px;
  --face-border-width: 2px;
  --face-radius: 8px;
  --face-padding: 1px;
  --face-text-size: var(--text-xs);
  --face-text-size--line-height: var(--text-xs--line-height);
}

.card-container--edit.card-container--lg {
  --face-padding: 14px;
}
.card-container--edit.card-container--base {
  --face-padding: 12px;
}
.card-container--edit.card-container--sm {
  --face-padding: 10px;
}
.card-container--edit.card-container--xs {
  --face-padding: 8px;
}
.card-container--edit.card-container--2xs {
  --face-padding: 6px;
}
.card-container--edit.card-container--3xs {
  --face-padding: 4px;
}
</style>
