<script setup lang="ts">
import UiIcon from '@/components/ui-kit/icon.vue'
import type { SfxOptions } from '@/sfx/directive'

export type ButtonProps = {
  theme?: MemberTheme
  size?: 'xl' | 'lg' | 'base' | 'sm' | 'xs'
  variant?: 'primary' | 'secondary'
  iconOnly?: boolean
  iconRight?: string
  iconLeft?: string
  fancyHover?: boolean
  loading?: boolean
  sfx?: SfxOptions
}

const {
  theme = 'blue-500',
  size = 'base',
  variant = 'primary',
  iconOnly = false,
  iconRight,
  iconLeft,
  fancyHover = true,
  sfx = { hover: 'ui.click_07' }
} = defineProps<ButtonProps>()
</script>

<template>
  <button
    data-testid="ui-kit-button"
    :data-theme="theme"
    class="ui-kit-btn group/btn"
    v-sfx="sfx"
    :class="[
      `ui-kit-btn--${size}`,
      `ui-kit-btn--${variant}`,
      {
        'btn-icon-only': iconOnly,
        'btn-fancy-hover': fancyHover
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
        'bgx-color-[var(--theme-neutral)]': variant === 'primary',
        'bgx-color-[var(--theme-on-neutral)]': variant === 'secondary'
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

  background-color: var(--btn-theme-primary);
  color: var(--btn-theme-secondary);
  font-size: var(--btn-font-size);
  line-height: var(--btn-font-size--line-height);

  outline: var(--btn-outline-width, 0) solid var(--btn-outline-color);
  border-radius: var(--btn-border-radius);
  padding: var(--btn-padding);
  height: max-content;
  width: max-content;

  display: flex;
  gap: var(--btn-gap);
  align-items: center;
  justify-content: center;
  user-select: none;
  cursor: pointer;
}

.ui-kit-btn.ui-kit-btn--primary {
  --btn-theme-primary: var(--theme-primary);
  --btn-theme-secondary: var(--theme-on-primary);
  --btn-outline-color: var(--theme-accent);
  --btn-icon-color: var(--theme-on-primary);
}
.ui-kit-btn.ui-kit-btn--secondary {
  --btn-theme-primary: var(--theme-neutral);
  --btn-theme-secondary: var(--theme-on-neutral);
  --btn-outline-color: var(--theme-accent);
  --btn-icon-color: var(--theme-primary);
}

.ui-kit-btn:hover {
  --btn-outline-width: 2px;
}

.ui-kit-btn .btn-icon {
  height: 100%;
  max-height: 100%;
  color: var(--btn-icon-color);
}

/* Button sizes */
.ui-kit-btn.ui-kit-btn--xl {
  --btn-font-size: var(--text-2xl);
  --btn-font-size--line-height: var(--text-2xl--line-height);
  --btn-border-radius: var(--radius-5_5);
  --btn-gap: 8px;
  --btn-padding: 14px 24px;
}
.ui-kit-btn.ui-kit-btn--lg {
  --btn-font-size: var(--text-lg);
  --btn-font-size--line-height: var(--text-xl--line-height);
  --btn-border-radius: var(--radius-5);
  --btn-gap: 16px;
  --btn-padding: 14px 20px;
}
.ui-kit-btn.ui-kit-btn--base {
  --btn-font-size: var(--text-base);
  --btn-font-size--line-height: var(--text-base--line-height);
  --btn-border-radius: var(--radius-4);
  --btn-gap: 8px;
  --btn-padding: 6px 10px;
}
.ui-kit-btn.ui-kit-btn--sm {
  --btn-font-size: var(--text-sm);
  --btn-font-size--line-height: var(--text-sm--line-height);
  --btn-border-radius: var(--radius-3);
  --btn-gap: 6px;
  --btn-padding: 4px 6px;
}
.ui-kit-btn.ui-kit-btn--xs {
  --btn-font-size: var(--text-sm);
  --btn-font-size--line-height: var(--text-sm--line-height);
  --btn-border-radius: var(--radius-3);
  --btn-gap: 6px;
  --btn-padding: 4px 6px;
}

/* Icon-only buttons */
.ui-kit-btn.btn-icon-only {
  --btn-padding: 8px;
  --btn-border-radius: var(--radius-4);
}
.ui-kit-btn.btn-icon-only .btn-icon {
  background-color: transparent;
}
.ui-kit-btn.btn-icon-only.btn-sm {
  --btn-padding: 4px;
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
