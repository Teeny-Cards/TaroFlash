<script setup lang="ts">
import { provide, ref } from 'vue'
import mobileSheet, { type MobileSheetProps } from './mobile-sheet.vue'
import { activeTabKey } from './tab-sheet-context'
import { emitSfx } from '@/sfx/bus'
import { tabContentEnter, tabContentLeave } from '@/utils/animations/tab-sheet'
import UiButton from '@/components/ui-kit/button.vue'
import UiIcon from '@/components/ui-kit/icon.vue'

type Tab = { label: string; value: string; icon?: string }

type TabSheetParts = {
  content?: string
  sidebar?: string
  tab?: string
}

type TabSheetProps = MobileSheetProps & {
  tabs?: Tab[]
  parts?: TabSheetParts
}

const props = defineProps<TabSheetProps>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const active = ref<string>(props.tabs?.[0]?.value ?? '')
provide(activeTabKey, active)

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
    <template #overlay>
      <slot name="overlay"></slot>
    </template>

    <template #header-content>
      <slot name="header-content"></slot>
    </template>

    <template v-if="tabs?.length" #sidebar>
      <div
        data-testid="tab-sheet__tabs"
        :class="[
          'flex flex-col gap-10 bg-brown-200 dark:bg-grey-900 p-4.5 shrink-0',
          parts?.sidebar
        ]"
      >
        <ui-button
          data-testid="tab-sheet__close-button"
          icon-left="close"
          icon-only
          @click="emit('close')"
        />

        <div data-testid="tab-sheet__tabs" class="flex flex-col gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            data-testid="tab-sheet__tab"
            :data-active="tab.value === active"
            :class="[
              'text-left py-3 px-4 rounded-4 flex items-center cursor-pointer text-brown-700 data-[active=true]:bg-(--theme-primary) data-[active=true]:text-(--theme-on-primary) hover:bg-(--theme-neutral) hover:text-(--theme-on-neutral) data-[active=false]:hover:[&_svg]:scale-120 data-[active=false]:hover:[&_svg]:rotate-6 [&_svg]:transition-transform [&_svg]:duration-75',
              parts?.tab
            ]"
            v-sfx.hover="tab.value === active ? '' : 'ui.click_07'"
            @click="selectOption(tab.value)"
          >
            <ui-icon v-if="tab.icon" :src="tab.icon" class="mr-2" />
            {{ tab.label }}
          </button>
        </div>
      </div>
    </template>

    <div data-testid="tab-sheet__content" :class="['p-8 pt-0', parts?.content]">
      <slot name="before"></slot>
      <Transition mode="out-in" :css="false" @enter="tabContentEnter" @leave="tabContentLeave">
        <div :key="active">
          <slot :name="active"></slot>
        </div>
      </Transition>
      <slot name="after"></slot>
    </div>
  </mobile-sheet>
</template>
