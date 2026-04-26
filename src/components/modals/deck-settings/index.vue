<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CoverDesignerToolbar from './cover-designer/index.vue'
import CardDesignerToolbar from './card-designer-toolbar.vue'
import TabBar from './tab-bar.vue'
import Card from '@/components/card/index.vue'
import { useDeckEditor } from '@/composables/deck-editor'
import UiButton from '@/components/ui-kit/button.vue'
import UiInput from '@/components/ui-kit/input.vue'
import UiToggle from '@/components/ui-kit/toggle.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import MobileSheet from '@/components/layout-kit/modal/mobile-sheet.vue'
import { emitSfx } from '@/sfx/bus'

export type DeckSettingsResponse = boolean

type DesignerTab = 'cover' | 'front' | 'back'

const { deck, close } = defineProps<{
  deck?: Deck
  close: (response?: DeckSettingsResponse) => void
}>()

const { t } = useI18n()
const { saveDeck, settings, cover, card_attributes } = useDeckEditor(deck)

const active_tab = ref<DesignerTab>('cover')

const tabs = computed(() => [
  { value: 'cover' as const, label: t('deck.settings-modal.designer-tabs.cover') },
  { value: 'front' as const, label: t('deck.settings-modal.designer-tabs.front') },
  { value: 'back' as const, label: t('deck.settings-modal.designer-tabs.back') }
])

const preview_text = computed(() =>
  active_tab.value === 'front' ? t('common.front') : t('common.back')
)

function onTabChange(tab: DesignerTab) {
  if (tab === active_tab.value) {
    emitSfx('ui.digi_powerdown')
    return
  }

  emitSfx('ui.slide_up')
  active_tab.value = tab
}

function cycleTab() {
  const index = tabs.value.findIndex((tab) => tab.value === active_tab.value)
  const next = (index + 1) % tabs.value.length
  onTabChange(tabs.value[next].value)
}

async function onSave() {
  const saved = await saveDeck()
  if (saved) close(true)
}
</script>

<template>
  <mobile-sheet
    data-testid="deck-settings-container"
    class="sm:max-w-200! sm:max-h-190"
    title="Deck Settings"
    @close="close(false)"
  >
    <template #body>
      <div
        data-testid="deck-settings__body"
        class="w-full flex flex-col items-center gap-6 sm:flex-row sm:gap-9 px-4"
      >
        <div data-testid="deck-designer" class="flex flex-col items-center gap-3">
          <tab-bar :tabs="tabs" :active="active_tab" @update:active="onTabChange" />

          <div
            data-testid="deck-designer__preview"
            class="relative flex w-min flex-col items-center"
          >
            <card
              size="xl"
              :side="active_tab"
              :front_text="active_tab === 'front' ? preview_text : undefined"
              :back_text="active_tab === 'back' ? preview_text : undefined"
              :cover_config="cover"
              :card_attributes="card_attributes"
              class="cursor-pointer"
              @click="cycleTab"
            />
          </div>

          <div data-testid="deck-designer__toolbar">
            <cover-designer-toolbar v-if="active_tab === 'cover'" :config="cover" />
            <card-designer-toolbar
              v-else-if="active_tab === 'front'"
              :attributes="card_attributes.front"
            />
            <card-designer-toolbar v-else :attributes="card_attributes.back" />
          </div>
        </div>

        <div class="w-full flex flex-col gap-5 items-start">
          <ui-input
            :placeholder="t('deck.title-placeholder')"
            text-align="center"
            size="lg"
            v-model:value="settings.title"
          />
          <ui-input
            :placeholder="t('deck.description-placeholder')"
            v-model:value="settings.description"
          />

          <ui-toggle v-model:checked="settings.is_public">
            <div class="flex items-center gap-2.5">
              <ui-icon src="public" />
              {{ t('deck.settings-modal.is-public') }}
            </div>
          </ui-toggle>
        </div>
      </div>
    </template>

    <template #footer>
      <div data-testid="deck-settings__footer" class="px-4 pb-4">
        <ui-button data-theme="blue-500" size="xl" @click="onSave" full-width>
          {{ deck ? t('common.save') : t('common.create') }}
        </ui-button>
      </div>
    </template>
  </mobile-sheet>
</template>
