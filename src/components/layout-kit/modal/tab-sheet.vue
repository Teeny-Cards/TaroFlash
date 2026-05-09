<script setup lang="ts">
import { ref } from 'vue'
import mobileSheet, { type MobileSheetProps } from './mobile-sheet.vue'
import { emitSfx } from '@/sfx/bus'
import UiButton from '@/components/ui-kit/button.vue'
import UiIcon from '@/components/ui-kit/icon.vue'

type Tab = { label: string; value: string; icon?: string }

type TabSheetProps = MobileSheetProps & {
  tabs?: Tab[]
}

const props = defineProps<TabSheetProps>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const active = ref<string>(props.tabs?.[0]?.value ?? '')

function selectOption(value: string) {
  if (value === active.value) {
    emitSfx('ui.digi_powerdown')
    return
  }

  emitSfx('ui.select')
  active.value = value
}
</script>

<template>
  <mobile-sheet v-bind="props" :show_close_button="false">
    <template v-if="tabs?.length" #sidebar>
      <div
        data-testid="tab-sheet__tabs"
        class="flex flex-col gap-10 bg-brown-200 dark:bg-grey-900 p-4.5 shrink-0"
      >
        <ui-button icon-left="close" icon-only @click="emit('close')" />

        <div class="flex flex-col gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            data-testid="tab-sheet__option"
            :data-active="tab.value === active"
            class="text-left py-3 px-4 rounded-4 flex items-center cursor-pointer text-brown-700 data-[active=true]:bg-(--theme-primary) data-[active=true]:text-brown-100"
            @click="selectOption(tab.value)"
          >
            <ui-icon v-if="tab.icon" :src="tab.icon" class="mr-2" />
            {{ tab.label }}
          </button>
        </div>
      </div>
    </template>

    <div data-testid="tab-sheet__content" class="p-8 pt-0">
      <slot name="before"></slot>
      <slot :name="active"></slot>
      <slot name="after"></slot>
    </div>
  </mobile-sheet>
</template>
