<script setup lang="ts">
import { computed } from 'vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import type { SfxOptions } from '@/sfx/directive'

export type ButtonProps = {
  theme?: MemberTheme
  size?: 'xl' | 'lg' | 'base' | 'sm' | 'xs'
  variant?: 'solid' | 'outline'
  inverted?: boolean
  iconOnly?: boolean
  roundedFull?: boolean
  iconRight?: string
  iconLeft?: string
  fancyHover?: boolean
  loading?: boolean
  sfx?: SfxOptions
}

const {
  theme = 'blue-500',
  size = 'base',
  variant = 'solid',
  iconOnly = false,
  iconRight,
  iconLeft,
  fancyHover = true,
  sfx = {}
} = defineProps<ButtonProps>()

const merged_sfx = computed(() => {
  return {
    ...sfx,
    hover: sfx.hover ?? 'ui.click_07'
  }
})
</script>

<template>
  <button
    data-testid="ui-kit-button"
    :data-theme="theme"
    class="ui-kit-btn group/btn"
    v-sfx="merged_sfx"
    :class="[
      `ui-kit-btn--${size}`,
      `ui-kit-btn--${variant}`,
      {
        'ui-kit-btn--icon-only': iconOnly,
        'ui-kit-btn--inverted': inverted,
        'rounded-full!': roundedFull
      }
    ]"
  >
    <ui-icon v-if="iconLeft" class="btn-icon" :src="iconLeft" />
    <div v-if="!iconOnly" class="btn-label">
      <slot></slot>
    </div>
    <ui-icon v-if="iconRight" class="btn-icon" :src="iconRight" />

    <div v-if="iconOnly && $slots.default" class="ui-kit-btn__tooltip">
      <slot></slot>
    </div>

    <div
      class="absolute inset-0 bgx-diagonal-stripes animation-safe:bgx-slide
        rounded-(--btn-border-radius) pointer-events-none"
      :class="{
        'bg-(--theme-primary) flex items-center justify-center': loading,
        hidden: !loading,
        'group-hover/btn:block': !loading && fancyHover,
        'bgx-color-[var(--theme-neutral)]': variant === 'solid',
        'bgx-color-[var(--theme-on-neutral)]': inverted
      }"
    >
      <ui-icon v-if="loading" src="loading-dots" class="h-12 w-12" />
    </div>
  </button>
</template>

<style>
/* Base button styles */
.ui-kit-btn {
  position: relative;

  background-color: var(--btn-bg-color);
  color: var(--btn-text-color);
  font-size: var(--btn-font-size);
  line-height: var(--btn-font-size--line-height);

  outline: var(--btn-outline-width, 0) solid var(--btn-outline-color);
  border-radius: var(--btn-border-radius);
  padding: var(--btn-padding);
  height: var(--btn-height, max-content);
  width: max-content;

  display: flex;
  gap: var(--btn-gap);
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
}

.ui-kit-btn--solid {
  --btn-bg-color: var(--theme-primary);
  --btn-text-color: var(--theme-on-primary);
  --btn-outline-color: var(--theme-accent);
}

.ui-kit-btn--outline {
  --btn-bg-color: transparent;
  --btn-text-color: var(--theme-primary);
  --btn-outline-width: 2px;
  --btn-outline-color: var(--theme-primary);
}

.ui-kit-btn--solid.ui-kit-btn--inverted {
  --btn-bg-color: var(--theme-neutral);
  --btn-text-color: var(--theme-primary);
  --btn-outline-color: var(--theme-accent);
}

.ui-kit-btn--outline.ui-kit-btn--inverted {
  --btn-bg-color: transparent;
  --btn-text-color: var(--theme-neutral);
  --btn-outline-width: 2px;
  --btn-outline-color: var(--theme-neutral);

  &:hover {
    --btn-bg-color: var(--theme-neutral);
    --btn-text-color: var(--theme-primary);
  }
}

.ui-kit-btn:hover {
  --btn-outline-width: 2px;
}

.ui-kit-btn .btn-icon {
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  z-index: 10;
}

.ui-kit-btn.ui-kit-btn--icon-only {
  --btn-padding: 8px;
  --btn-border-radius: var(--radius-4);
  aspect-ratio: 1/1;
}

/* Button sizes */
.ui-kit-btn.ui-kit-btn--xl {
  --btn-font-size: var(--text-xl);
  --btn-font-size--line-height: var(--text-xl--line-height);
  --btn-border-radius: var(--radius-5_5);
  --btn-gap: 16px;
  --btn-padding: 14px 24px;
  --btn-height: 50px;
}
.ui-kit-btn.ui-kit-btn--lg {
  --btn-font-size: var(--text-lg);
  --btn-font-size--line-height: var(--text-xl--line-height);
  --btn-border-radius: var(--radius-5);
  --btn-gap: 16px;
  --btn-padding: 14px 20px;
  --btn-height: 46px;

  &.ui-kit-btn--icon-only {
    --btn-padding: 10px;
  }
}
.ui-kit-btn.ui-kit-btn--base {
  --btn-font-size: var(--text-base);
  --btn-font-size--line-height: var(--text-base--line-height);
  --btn-border-radius: var(--radius-4);
  --btn-gap: 8px;
  --btn-padding: 6px 10px;
  --btn-height: 40px;

  &.ui-kit-btn--icon-only {
    --btn-padding: 8px;
    --btn-border-radius: var(--radius-4_5);
  }
}
.ui-kit-btn.ui-kit-btn--sm {
  --btn-font-size: var(--text-sm);
  --btn-font-size--line-height: var(--text-sm--line-height);
  --btn-border-radius: var(--radius-3);
  --btn-gap: 6px;
  --btn-padding: 4px 6px;

  &.ui-kit-btn--icon-only {
    --btn-padding: 4px;
  }
}
.ui-kit-btn.ui-kit-btn--xs {
  --btn-font-size: var(--text-sm);
  --btn-font-size--line-height: var(--text-sm--line-height);
  --btn-border-radius: var(--radius-3_25);
  --btn-gap: 6px;
  --btn-padding: 4px 6px;
  --btn-height: 30px;

  &.ui-kit-btn--icon-only {
    --btn-padding: 4px;
  }
}

/* Button tooltips */
.ui-kit-btn__tooltip {
  display: none;
  position: absolute;
  top: -22px;

  border-radius: var(--radius-full);
  padding: 6px 8px;

  font-size: var(--text-sm);
  line-height: var(--text-sm--line-height);
  color: var(--color-brown-700);
  white-space: nowrap;
  background-color: var(--color-white);

  pointer-events: none;
  z-index: 10;
}
.ui-kit-btn:hover .ui-kit-btn__tooltip {
  display: block;
}
</style>
