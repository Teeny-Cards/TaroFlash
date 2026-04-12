<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiPopover from '@/components/ui-kit/popover.vue'
import UiButton from '@/components/ui-kit/button.vue'
import UiRadio from '@/components/ui-kit/radio.vue'

type CoverColorPickerProps = {
  supported_themes: MemberTheme[]
  selected_theme?: MemberTheme
  label: string
  allowNone?: boolean
  icon?: string
}

const { supported_themes, selected_theme } = defineProps<CoverColorPickerProps>()

const emit = defineEmits<{
  (e: 'select', theme: MemberTheme | undefined): void
}>()

const { t } = useI18n()
const open = ref(false)

function select(theme: MemberTheme | undefined) {
  emit('select', theme)
}
</script>

<template>
  <ui-popover
    data-testid="cover-designer-popover-container"
    position="left"
    :gap="24"
    :use_arrow="false"
    :open="open"
    :fallback_placements="['top']"
    @close="open = false"
  >
    <template #trigger>
      <div class="flex flex-col gap-1">
        <ui-button
          data-testid="cover-designer-popover__trigger"
          v-sfx="{ hover: 'ui.click_07', click: 'ui.select' }"
          @click="open = !open"
          :icon-left="icon"
          icon-only
          theme="brown-100"
          size="lg"
        >
          {{ label }}
        </ui-button>
      </div>
    </template>

    <div
      data-testid="cover-designer-popover"
      class="rounded-4 shadow-sm bg-brown-100 p-4 shadow-xl grid grid-cols-2 gap-3"
    >
      <ui-radio
        v-for="theme in supported_themes"
        :key="theme"
        :theme="theme"
        :checked="selected_theme === theme"
        inverted
        @click="select(theme)"
      />
    </div>
  </ui-popover>
</template>
