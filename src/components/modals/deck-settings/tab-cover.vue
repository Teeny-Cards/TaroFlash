<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import UiIcon from '@/components/ui-kit/icon.vue'
import Card from '@/components/card/index.vue'

const { t } = useI18n()

const bg_color = defineModel<MemberTheme | undefined>('bg_color')
const border_color = defineModel<MemberTheme | undefined>('border_color')
const pattern = defineModel<DeckCoverPattern | undefined>('pattern')
const pattern_color = defineModel<MemberTheme | undefined>('pattern_color')

const THEMES: MemberTheme[] = [
  'white',
  'brown-100',
  'brown-300',
  'grey-400',
  'blue-400',
  'blue-500',
  'blue-650',
  'blue-800',
  'green-400',
  'purple-700',
  'purple-500',
  'pink-400',
  'red-400',
  'red-500',
  'orange-500',
  'orange-600'
]

type PatternDef = { key: DeckCoverPattern; label: string }

const PATTERNS: PatternDef[] = [
  { key: 'diagonal-stripes', label: 'Lines' },
  { key: 'dot-grid', label: 'Dots' },
  { key: 'wave', label: 'Wave' },
  { key: 'saw', label: 'Saw' },
  { key: 'bank-note', label: 'Bank Note' },
  { key: 'aztec', label: 'Aztec' },
  { key: 'endless-clouds', label: 'Clouds' },
  { key: 'stars', label: 'Stars' },
  { key: 'leaf', label: 'Leaf' }
]

// Static map — ensures all bgx-* class names appear as literals for the build scanner.
const PATTERN_CLASS: Record<DeckCoverPattern, string> = {
  'diagonal-stripes': 'bgx-diagonal-stripes',
  saw: 'bgx-saw',
  wave: 'bgx-wave',
  'bank-note': 'bgx-bank-note',
  aztec: 'bgx-aztec',
  'endless-clouds': 'bgx-endless-clouds',
  stars: 'bgx-stars',
  leaf: 'bgx-leaf',
  'dot-grid': 'bgx-dot-grid'
}

function patternSwatchStyle(): Record<string, string> {
  return {
    backgroundColor: bg_color.value ? `var(--color-${bg_color.value})` : 'var(--color-white)',
    '--bgx-fill': `var(--color-${pattern_color.value ?? 'grey-900'})`,
    '--bgx-opacity': '0.5',
    '--bgx-size': '8px'
  }
}

const previewCover = computed(
  (): DeckCover => ({
    bg_color: bg_color.value,
    border_color: border_color.value,
    pattern: pattern.value,
    pattern_color: pattern_color.value
  })
)
</script>

<template>
  <div class="flex gap-8">
    <div class="flex flex-1 flex-col gap-5">
      <!-- Background Color -->
      <div class="flex flex-col gap-2">
        <span class="text-sm font-medium text-brown-700">
          {{ t('deck.settings-modal.cover.bg-color') }}
        </span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="theme in THEMES"
            :key="theme"
            :data-theme="theme"
            :title="theme"
            class="h-7 w-7 cursor-pointer rounded-full transition-all duration-75"
            :class="
              bg_color === theme
                ? 'scale-110 ring-3 ring-brown-700 ring-offset-2'
                : 'hover:scale-105'
            "
            style="background-color: var(--theme-primary); outline: 1px solid rgba(0, 0, 0, 0.08)"
            @click="bg_color = theme"
          />
          <button
            :title="t('common.none')"
            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-brown-400 transition-all duration-75"
            :class="!bg_color ? 'ring-3 ring-brown-700 ring-offset-2' : 'hover:scale-105'"
            @click="bg_color = undefined"
          >
            <ui-icon src="close" class="h-3 w-3 text-brown-400" />
          </button>
        </div>
      </div>

      <!-- Border Color -->
      <div class="flex flex-col gap-2">
        <span class="text-sm font-medium text-brown-700">
          {{ t('deck.settings-modal.cover.border-color') }}
        </span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="theme in THEMES"
            :key="theme"
            :data-theme="theme"
            :title="theme"
            class="h-7 w-7 cursor-pointer rounded-full transition-all duration-75"
            :class="
              border_color === theme
                ? 'scale-110 ring-3 ring-brown-700 ring-offset-2'
                : 'hover:scale-105'
            "
            style="background-color: var(--theme-primary); outline: 1px solid rgba(0, 0, 0, 0.08)"
            @click="border_color = theme"
          />
          <button
            :title="t('common.none')"
            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-brown-400 transition-all duration-75"
            :class="!border_color ? 'ring-3 ring-brown-700 ring-offset-2' : 'hover:scale-105'"
            @click="border_color = undefined"
          >
            <ui-icon src="close" class="h-3 w-3 text-brown-400" />
          </button>
        </div>
      </div>

      <!-- Pattern -->
      <div class="flex flex-col gap-2">
        <span class="text-sm font-medium text-brown-700">
          {{ t('deck.settings-modal.cover.pattern') }}
        </span>
        <div class="flex flex-wrap gap-2">
          <button
            :title="t('common.none')"
            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-2 border-2 border-brown-300 bg-brown-100 transition-all duration-75"
            :class="!pattern ? 'scale-110 ring-3 ring-brown-700' : 'hover:scale-105'"
            @click="pattern = undefined"
          >
            <ui-icon src="close" class="h-3 w-3 text-brown-400" />
          </button>
          <button
            v-for="pat in PATTERNS"
            :key="pat.key"
            :title="pat.label"
            class="h-10 w-10 cursor-pointer rounded-2 border-2 transition-all duration-75"
            :class="[
              pattern === pat.key
                ? 'scale-110 border-brown-700 ring-3 ring-brown-700'
                : 'border-brown-300 hover:scale-105',
              PATTERN_CLASS[pat.key]
            ]"
            :style="patternSwatchStyle()"
            @click="pattern = pat.key"
          />
        </div>
      </div>

      <!-- Pattern Color -->
      <div v-if="pattern" class="flex flex-col gap-2">
        <span class="text-sm font-medium text-brown-700">
          {{ t('deck.settings-modal.cover.pattern-color') }}
        </span>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="theme in THEMES"
            :key="theme"
            :data-theme="theme"
            :title="theme"
            class="h-7 w-7 cursor-pointer rounded-full transition-all duration-75"
            :class="
              pattern_color === theme
                ? 'scale-110 ring-3 ring-brown-700 ring-offset-2'
                : 'hover:scale-105'
            "
            style="background-color: var(--theme-primary); outline: 1px solid rgba(0, 0, 0, 0.08)"
            @click="pattern_color = theme"
          />
        </div>
      </div>
    </div>

    <!-- Live preview -->
    <div class="flex flex-col items-center gap-2">
      <span class="text-sm text-brown-500">{{ t('deck.settings-modal.cover.preview') }}</span>
      <card data-testid="cover-preview" size="sm" side="cover" :cover_config="previewCover" />
    </div>
  </div>
</template>
