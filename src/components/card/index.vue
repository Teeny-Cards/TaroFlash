<script setup lang="ts">
import CardFace from './card-face.vue'
import type { ImageUploadEvent } from '@/components/image-uploader.vue'

type CardProps = {
  size?: '2xl' | 'xl' | 'lg' | 'base' | 'sm' | 'xs' | '2xs' | '3xs'
  mode?: 'view' | 'edit' | 'select'
  side?: 'front' | 'back'
  front_image_url?: string
  front_text?: string
  back_image_url?: string
  back_text?: string
  max_length?: number
}

const {
  size = 'base',
  front_image_url,
  back_image_url,
  side = 'front',
  mode = 'view'
} = defineProps<CardProps>()

const emit = defineEmits<{
  (e: 'image-uploaded', event: ImageUploadEvent): void
  (e: 'update:front_text', text: string): void
  (e: 'update:back_text', text: string): void
  (e: 'focusin'): void
  (e: 'focusout'): void
}>()
</script>

<template>
  <div
    data-testid="card"
    class="card-container"
    :class="`card-container--${size} card-container--${mode}`"
  >
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
      <slot name="front" v-if="side === 'front'">
        <card-face
          data-testid="card-face__front"
          :image="front_image_url"
          :text="front_text"
          :max_length="max_length"
          :mode="mode"
          @image-uploaded="emit('image-uploaded', $event)"
          @update:text="emit('update:front_text', $event)"
          @focusin="emit('focusin')"
          @focusout="emit('focusout')"
        />
      </slot>

      <slot name="back" v-else>
        <card-face
          data-testid="card-face__back"
          :image="back_image_url"
          :text="back_text"
          :max_length="max_length"
          :mode="mode"
          @image-uploaded="emit('image-uploaded', $event)"
          @update:text="emit('update:back_text', $event)"
          @focusin="emit('focusin')"
          @focusout="emit('focusout')"
        />
      </slot>
    </transition>
  </div>
</template>

<style>
.card-container {
  --min-element-height: 80px;

  aspect-ratio: var(--aspect-card);
  position: relative;
  width: var(--card-width);
  transition: width 0.05s ease-in-out;

  font-size: var(--text-base);
  line-height: var(--text-base--line-height);
}

.card-container--2xl {
  --card-width: 380px;
  --face-border-width: 12px;
  --face-radius: 70px;
  --face-padding: 16px;
}
.card-container--xl {
  --card-width: 314px;
  --face-border-width: 10px;
  --face-radius: 58px;
  --face-padding: 14px;
  --min-element-height: 100px;
}
.card-container--lg {
  --card-width: 260px;
  --face-border-width: 8px;
  --face-radius: 56px;
  --face-padding: 12px;
}
.card-container--base {
  --card-width: 192px;
  --face-border-width: 6px;
  --face-radius: 40px;
  --face-padding: 8px;
  --min-element-height: 80px;
}
.card-container--sm {
  --card-width: 138px;
  --face-border-width: 6px;
  --face-radius: 32px;
  --face-padding: 6px;
}
.card-container--xs {
  --card-width: 102px;
  --face-border-width: 4px;
  --face-radius: 24px;
  --face-padding: 4px;
}
.card-container--2xs {
  --card-width: 43px;
  --face-border-width: 3px;
  --face-radius: 14px;
  --face-padding: 2px;
}
.card-container--3xs {
  --card-width: 28px;
  --face-border-width: 2px;
  --face-radius: 8px;
  --face-padding: 1px;
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
