<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAudio } from '@/composables/use-audio'

export type SplitButtonOption = {
  label: string
  icon?: string
  default?: boolean
  theme?: 'blue' | 'purple' | 'orange' | 'green' | 'pink' | 'red' | 'grey'
  [key: string]: any
}

const { options } = defineProps<{
  options: SplitButtonOption[]
  ring?: boolean
}>()

const emit = defineEmits<{
  (e: 'option-clicked', option: SplitButtonOption): void
}>()

const audio = useAudio()
const open = ref(false)

const default_options = computed(() => {
  return options.filter((option) => option.default)
})

const non_default_options = computed(() => {
  return options.filter((option) => !option.default)
})

function onToggle() {
  audio.play('etc_camera_reel')
  open.value = !open.value
}

function onOptionClicked(option: SplitButtonOption) {
  audio.play('etc_camera_shutter')
  emit('option-clicked', option)
  open.value = false
}
</script>

<template>
  <div data-testid="ui-kit-split-button" class="ui-kit-split-button">
    <button
      v-for="option in default_options"
      data-testid="ui-kit-split-button__default-option"
      class="ui-kit-split-button__default-option"
      :class="`ui-kit-split-button__default-option--${option.theme ?? 'blue'} `"
      @click="onOptionClicked(option)"
      @mouseenter="audio.play('click_07')"
    >
      <slot>
        <ui-kit:icon v-if="option?.icon" :src="option.icon" size="small" />
        <span>{{ option.label }}</span>
      </slot>
    </button>

    <button
      data-testid="ui-kit-split-button__toggle"
      class="ui-kit-split-button__toggle"
      @click="onToggle"
      @mouseenter="audio.play('click_07')"
    >
      <ui-kit:icon src="arrow-drop-down" size="large" />
    </button>

    <div
      v-if="open"
      data-testid="ui-kit-split-button__dropdown"
      class="ui-kit-split-button__dropdown"
    >
      <div
        v-for="option in non_default_options"
        data-testid="ui-kit-split-button__dropdown__option"
        class="ui-kit-split-button__dropdown__option"
        :class="`ui-kit-split-button__dropdown__option--${option.theme ?? 'blue'} `"
        @click="onOptionClicked(option)"
        @mouseenter="audio.play('click_07')"
      >
        <slot name="option" :option="option">
          <span>{{ option.label }}</span>
          <ui-kit:icon v-if="option.icon" :src="option.icon" size="small" />
        </slot>
      </div>
    </div>

    <div
      data-testid="ui-kit-split-button__ring"
      class="ui-kit-split-button__ring"
      v-if="ring"
    ></div>
  </div>
</template>

<style>
@reference '@/styles/main.css';

.ui-kit-split-button {
  @apply relative flex h-9 items-center justify-center gap-0.5 transition-[all] duration-75;
}

.ui-kit-split-button__ring {
  @apply rounded-6 absolute -inset-2 -z-1 bg-white;
}

.ui-kit-split-button__default-option {
  background-color: var(--theme);

  @apply rounded-1.5 flex h-full cursor-pointer items-center gap-1.5 px-3.5 py-1.5 text-white outline-none hover:scale-110;
}

.ui-kit-split-button__default-option:first-child {
  @apply rounded-s-4;
}

.ui-kit-split-button__toggle {
  @apply rounded-e-4 rounded-s-1.5 flex h-full w-9 cursor-pointer items-center justify-center bg-blue-500 text-white outline-none hover:scale-110;
}

.ui-kit-split-button__dropdown {
  @apply absolute top-full right-0 z-10 mt-0.75 flex min-w-full flex-col gap-0.75;
}

.ui-kit-split-button__dropdown__option {
  background-color: var(--theme);

  @apply rounded-3.5 shadow-button flex cursor-pointer items-center justify-between gap-1.5 bg-blue-500 px-3.5 py-1.5 text-white outline-none hover:scale-110;
}

.ui-kit-split-button__default-option--blue,
.ui-kit-split-button__dropdown__option--blue {
  --theme: var(--color-blue-500);
}

.ui-kit-split-button__default-option--purple,
.ui-kit-split-button__dropdown__option--purple {
  --theme: var(--color-purple-500);
}

.ui-kit-split-button__default-option--orange,
.ui-kit-split-button__dropdown__option--orange {
  --theme: var(--color-orange-500);
}

.ui-kit-split-button__default-option--green,
.ui-kit-split-button__dropdown__option--green {
  --theme: var(--color-green-500);
}

.ui-kit-split-button__default-option--pink,
.ui-kit-split-button__dropdown__option--pink {
  --theme: var(--color-pink-500);
}

.ui-kit-split-button__default-option--red,
.ui-kit-split-button__dropdown__option--red {
  --theme: var(--color-red-500);
}

.ui-kit-split-button__default-option--grey,
.ui-kit-split-button__dropdown__option--grey {
  --theme: var(--color-grey-400);
}
</style>
