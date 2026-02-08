<script setup lang="ts">
import UiIcon from '@/components/ui-kit/icon.vue'
import UiPopover from '@/components/ui-kit/popover.vue'
import UiImage from '@/components/ui-kit/image.vue'
import { ref } from 'vue'

defineProps<{
  color?: MemberTheme
}>()

const emit = defineEmits<{
  (e: 'select', color: MemberTheme): void
}>()

const open = ref(false)

const themes: MemberTheme[] = [
  'green-400',
  'blue-500',
  'purple-500',
  'pink-500',
  'red-500',
  'orange-500'
]
</script>

<template>
  <ui-popover mode="click" :open="open" shadow :gap="24" @close="open = false">
    <template #trigger>
      <ui-image src="paint-roller" size="unset" @click="open = !open" class="cursor-pointer" />
    </template>

    <div
      data-testid="toolbar__color-selector"
      class="grid grid-cols-3 gap-3 bg-brown-300 rounded-6 p-4"
    >
      <div
        v-for="theme in themes"
        :key="theme"
        class="ring-brown-100 relative h-8.5 w-8.5 cursor-pointer rounded-full ring-4 transition-all
          duration-75 hover:scale-110"
        :class="`selector--${theme}`"
        v-sfx.hover="'ui.click_04'"
        @click="emit('select', theme)"
      >
        <ui-icon
          src="check"
          v-if="theme === color"
          class="ring-brown-100 bg-brown-100 absolute -top-1.5 -right-1.5 rounded-full ring-2"
        ></ui-icon>
      </div>
    </div>
  </ui-popover>
</template>

<style>
.selector--green-400 {
  background-color: var(--color-green-400);
}
.selector--blue-400 {
  background-color: var(--color-blue-400);
}
.selector--purple-400 {
  background-color: var(--color-purple-400);
}
.selector--pink-400 {
  background-color: var(--color-pink-400);
}
.selector--red-400 {
  background-color: var(--color-red-400);
}
.selector--orange-400 {
  background-color: var(--color-orange-400);
}
.selector--brown-300 {
  background-color: var(--color-brown-300);
}
.selector--white {
  background-color: var(--color-white);
}
</style>
