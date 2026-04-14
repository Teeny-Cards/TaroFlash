<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import UiIcon from '@/components/ui-kit/icon.vue'
import UiPopover from '@/components/ui-kit/popover.vue'
import { type SfxOptions } from '@/sfx/directive'

type CardDefaultsToolbarProps = {
  card_defaults: DeckCardDefaults
}

const { card_defaults } = defineProps<CardDefaultsToolbarProps>()

const { t } = useI18n()

const size_popover_open = ref(false)

const sfx: SfxOptions = { hover: 'ui.click_07', click: 'ui.select' }
const option_sfx: SfxOptions = { hover: 'ui.click_07', click: 'ui.toggle_on' }

type TextSizeOption = NonNullable<DeckCardDefaults['text_size']>

const text_size_options: { value: TextSizeOption; label: string }[] = [
  { value: 'small', label: t('deck-view.card-defaults.text-size.small') },
  { value: 'medium', label: t('deck-view.card-defaults.text-size.medium') },
  { value: 'large', label: t('deck-view.card-defaults.text-size.large') },
  { value: 'x-large', label: t('deck-view.card-defaults.text-size.x-large') },
  { value: 'huge', label: t('deck-view.card-defaults.text-size.huge') },
  { value: 'ginormous', label: t('deck-view.card-defaults.text-size.ginormous') }
]

type HAlign = NonNullable<DeckCardDefaults['horizontal_alignment']>
type VAlign = NonNullable<DeckCardDefaults['vertical_alignment']>

const h_align_options: { value: HAlign; icon: string }[] = [
  { value: 'left', icon: 'align-left' },
  { value: 'center', icon: 'align-center' },
  { value: 'right', icon: 'align-right' }
]

const v_align_options: { value: VAlign; icon: string }[] = [
  { value: 'top', icon: 'align-v-top' },
  { value: 'center', icon: 'align-v-center' },
  { value: 'bottom', icon: 'align-v-bottom' }
]

const current_size = () => card_defaults.text_size ?? 'large'
const current_h_align = () => card_defaults.horizontal_alignment ?? 'center'
const current_v_align = () => card_defaults.vertical_alignment ?? 'center'

function currentSizeLabel() {
  return text_size_options.find((o) => o.value === current_size())?.label ?? ''
}
</script>

<template>
  <div data-testid="card-defaults-toolbar" data-theme="brown-100">
    <p class="text-sm text-brown-500 dark:text-brown-400 mb-2">
      {{ t('deck-view.card-defaults.title') }}
    </p>

    <div data-testid="card-defaults-toolbar__controls" class="flex items-center gap-2">
      <ui-popover
        position="bottom-start"
        :gap="4"
        :use_arrow="false"
        :open="size_popover_open"
        :fallback_placements="['top-start']"
        @close="size_popover_open = false"
      >
        <template #trigger>
          <button
            data-testid="card-defaults-toolbar__text-size"
            class="card-defaults-btn flex items-center gap-1 justify-between w-32"
            v-sfx="sfx"
            @pointerdown.prevent
            @click.prevent="size_popover_open = !size_popover_open"
          >
            {{ currentSizeLabel() }}
            <ui-icon src="carat-down" class="size-3" :class="{ 'rotate-180': size_popover_open }" />
          </button>
        </template>

        <div
          data-testid="card-defaults-toolbar__text-size-options"
          class="flex flex-col bg-(--theme-primary) rounded-2.5 p-1 w-32 shadow-xs"
        >
          <div
            v-for="option in text_size_options"
            :key="option.value"
            class="cursor-pointer rounded-2 text-(--theme-on-primary) p-2 hover:bg-(--theme-secondary)"
            :class="{ 'bg-(--theme-secondary)': option.value === current_size() }"
            v-sfx="option_sfx"
            @pointerdown.prevent
            @click.prevent="card_defaults.text_size = option.value"
          >
            {{ option.label }}
          </div>
        </div>
      </ui-popover>

      <div data-testid="card-defaults-toolbar__h-align" class="flex gap-1">
        <button
          v-for="option in h_align_options"
          :key="option.value"
          class="card-defaults-btn card-defaults-btn--icon-only"
          :class="{ 'card-defaults-btn--active': option.value === current_h_align() }"
          v-sfx="option_sfx"
          @pointerdown.prevent
          @click.prevent="card_defaults.horizontal_alignment = option.value"
        >
          <ui-icon :src="option.icon" />
        </button>
      </div>

      <div data-testid="card-defaults-toolbar__v-align" class="flex gap-1">
        <button
          v-for="option in v_align_options"
          :key="option.value"
          class="card-defaults-btn card-defaults-btn--icon-only"
          :class="{ 'card-defaults-btn--active': option.value === current_v_align() }"
          v-sfx="option_sfx"
          @pointerdown.prevent
          @click.prevent="card_defaults.vertical_alignment = option.value"
        >
          <ui-icon :src="option.icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.card-defaults-btn {
  height: 40px;
  padding: 8px;
  border-radius: var(--radius-2_5);
  color: var(--theme-on-primary);
  background-color: var(--theme-primary);
  cursor: pointer;
}

.card-defaults-btn:hover {
  background-color: var(--theme-secondary);
}

.card-defaults-btn--icon-only {
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-defaults-btn--active {
  background-color: var(--theme-secondary);
}
</style>
