<script setup lang="ts">
import { computed } from 'vue'
import CardFace from './card-face.vue'
import { type TextEditorUpdatePayload } from '@/composables/rich-text-editor'
import { type CardEditorMode } from '@/composables/card-bulk-editor'
import { type CardBase, type ImageCard } from '@type/card'
import { getImageUrl } from '@/api/media'
import { type SfxOptions } from '@/sfx/directive'

type CardProps = Partial<CardBase> &
  ImageCard & {
    size?: '2xl' | 'xl' | 'lg' | 'base' | 'sm' | 'xs' | '2xs' | '3xs'
    mode?: CardEditorMode
    side?: 'front' | 'back'
    placeholder?: string
    face_classes?: string
    sfx?: SfxOptions
  }

const {
  size = 'base',
  side = 'front',
  mode = 'view',
  front_image_path,
  back_image_path
} = defineProps<CardProps>()

const emit = defineEmits<{
  (e: 'update:front', payload: TextEditorUpdatePayload): void
  (e: 'update:back', payload: TextEditorUpdatePayload): void
  (e: 'focusin'): void
  (e: 'focusout'): void
}>()

const front_image_url = computed(() => {
  if (!front_image_path) return undefined
  return getImageUrl('cards', front_image_path)
})

const back_image_url = computed(() => {
  if (!back_image_path) return undefined
  return getImageUrl('cards', back_image_path)
})
</script>

<template>
  <div
    data-testid="card"
    class="card-container"
    :class="`card-container--${size} card-container--${mode}
      card-container--${attributes?.bg_color || 'white'}`"
    v-sfx="sfx"
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
          :class="face_classes"
          :image="front_image_url"
          :text="front_text"
          :editor_delta="front_delta"
          :mode="mode"
          :side="side"
          :attributes="attributes"
          :placeholder="placeholder"
          @update="emit('update:front', $event)"
          @focusin.prevent="emit('focusin')"
          @focusout.prevent="emit('focusout')"
        />
      </slot>

      <slot name="back" v-else>
        <card-face
          data-testid="card-face__back"
          :class="face_classes"
          :image="back_image_url"
          :text="back_text"
          :editor_delta="back_delta"
          :mode="mode"
          :side="side"
          :attributes="attributes"
          :placeholder="placeholder"
          @update="emit('update:back', $event)"
          @focusin.prevent="emit('focusin')"
          @focusout.prevent="emit('focusout')"
        />
      </slot>
    </transition>
  </div>
</template>

<style>
.card-container {
  --min-element-height: 80px;
  --card-bg-color: var(--color-white);
  --card-text-color: var(--color-brown-700);
  --card-text-color--placeholder: var(--color-brown-500);
  --card-font-size: var(--text-base);
  --card-font-size--line-height: var(--text-base--line-height);

  aspect-ratio: var(--aspect-card);
  position: relative;
  width: var(--card-width);
  transition: width 0.05s ease-in-out;

  font-size: var(--card-font-size);
  line-height: var(--card-font-size--line-height);
}

.card-container--2xl {
  --card-width: 380px;
  --face-border-width: 6px;
  --face-radius: 70px;
  --face-padding: 42px;
}
.card-container--xl {
  --card-width: 314px;
  --face-border-width: 6px;
  --face-radius: 58px;
  --face-padding: 30px;
  --min-element-height: 80px;
  --card-font-size: var(--text-lg);
  --card-font-size--line-height: var(--text-lg--line-height);
}
.card-container--lg {
  --card-width: 260px;
  --face-border-width: 6px;
  --face-radius: 56px;
  --face-padding: 24px;
}
.card-container--base {
  --card-width: 192px;
  --face-border-width: 4px;
  --face-radius: 40px;
  --face-padding: 20px;
  --min-element-height: 80px;
}
.card-container--sm {
  --card-width: 138px;
  --face-border-width: 4px;
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

.card-container--green {
  --card-bg-color: var(--color-green-400);
}
.card-container--blue {
  --card-bg-color: var(--color-blue-400);
}
.card-container--purple {
  --card-bg-color: var(--color-purple-400);
}
.card-container--pink {
  --card-bg-color: var(--color-pink-400);
}
.card-container--red {
  --card-bg-color: var(--color-red-400);
}
.card-container--orange {
  --card-bg-color: var(--color-orange-400);
}
.card-container--brown {
  --card-bg-color: var(--color-brown-300);
}

@media (prefers-color-scheme: dark) {
  .card-container {
    --card-bg-color: var(--color-brown-300);
    --card-text-color: var(--color-brown-800);
    --card-text-color--placeholder: var(--color-brown-500);
  }

  .card-container--green {
    --card-bg-color: var(--color-green-400);
  }
  .card-container--blue {
    --card-bg-color: var(--color-blue-400);
  }
  .card-container--purple {
    --card-bg-color: var(--color-purple-400);
  }
  .card-container--pink {
    --card-bg-color: var(--color-pink-400);
  }
  .card-container--red {
    --card-bg-color: var(--color-red-400);
  }
  .card-container--orange {
    --card-bg-color: var(--color-orange-400);
  }
  .card-container--brown {
    --card-bg-color: var(--color-brown-300);
  }
}
</style>
