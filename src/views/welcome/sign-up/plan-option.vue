<script setup lang="ts">
import UiRadio from '@/components/ui-kit/radio.vue'

const { theme = 'brown-100' } = defineProps<{
  theme?: MemberTheme
  name: string
  selected?: boolean
}>()

const emit = defineEmits<{
  (e: 'select'): void
}>()

function onSelect() {
  emit('select')
}
</script>

<template>
  <div data-testid="plan-option-container" class="flex flex-col items-center gap-2">
    <button
      data-testid="plan-option"
      class="w-full h-full flex items-center justify-center rounded-11 p-2 cursor-pointer relative
        transition-colors duration-75"
      :class="{
        'outline-3 outline-blue-500': selected,
        'outline-2 outline-brown-100 hover:outline-blue-500': !selected
      }"
      @click="onSelect"
      v-sfx.click="'ui.etc_camera_shutter'"
    >
      <div
        class="w-full h-full flex gap-4 flex-col items-start bgx-leaf bgx-size-25 rounded-9 px-11
          py-5 bgx-opacity-10"
        :class="{
          'bg-brown-100 bgx-color-brown-500': theme === 'brown-100',
          'bg-green-400': theme === 'green-400',
          'bg-blue-500 bgx-fill-brown-100': theme === 'blue-500'
        }"
      >
        <slot name="header"></slot>

        <div class="flex flex-col gap-2 items-start">
          <slot></slot>
        </div>
      </div>

      <ui-radio :checked="selected" class="absolute! -top-1 -left-1" />
    </button>

    <h2
      class="text-2xl"
      :class="{
        'text-blue-500': selected,
        'text-brown-700 dark:text-brown-100': !selected
      }"
    >
      {{ name }}
    </h2>
  </div>
</template>
