<script setup lang="ts">
import { emitSfx } from '@/sfx/bus'

const checked = defineModel<boolean>('checked')
</script>

<template>
  <label
    data-testid="ui-kit-toggle"
    :data-checked="checked"
    class="flex cursor-pointer items-center justify-between gap-2"
  >
    <span data-testid="ui-kit-toggle__label" class="text-(--theme-nuetral)">
      <slot></slot>
    </span>

    <span
      data-testid="ui-kit-toggle__switch"
      class="flex w-12 items-center rounded-full p-1 transition-colors bg-(--theme-neutral) has-checked:bg-(--theme-primary)"
    >
      <input
        type="checkbox"
        v-model="checked"
        class="peer sr-only"
        @change="emitSfx('ui.select')"
        v-sfx.hover="'ui.click_07'"
      />
      <span
        data-testid="ui-kit-toggle__switch-handle"
        class="size-5 rounded-full transition-all duration-100 ease-in-out bg-(--theme-on-neutral) peer-checked:bg-(--theme-neutral) peer-checked:translate-x-full"
      ></span>
    </span>
  </label>
</template>
