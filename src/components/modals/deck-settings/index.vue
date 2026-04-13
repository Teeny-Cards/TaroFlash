<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import coverDesigner from './cover-designer/index.vue'
import { useDeckEditor } from '@/composables/deck-editor'
import UiButton from '@/components/ui-kit/button.vue'
import UiInput from '@/components/ui-kit/input.vue'
import UiToggle from '@/components/ui-kit/toggle.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import MobileSheet from '@/components/layout-kit/modal/mobile-sheet.vue'

export type DeckSettingsResponse = boolean

const { deck, close } = defineProps<{
  deck?: Deck
  close: (response?: DeckSettingsResponse) => void
}>()

const { t } = useI18n()
const { saveDeck } = useDeckEditor(deck)

const title = ref(deck?.title ?? '')
const description = ref(deck?.description ?? '')
const isPublic = ref(deck?.is_public ?? true)

async function onSave() {
  await saveDeck()
  close(true)
}
</script>

<template>
  <mobile-sheet
    data-testid="deck-settings-container"
    fill-height
    title="Deck Settings"
    class="bg-brown-300 dark:bg-grey-800 rounded-t-8 sm:rounded-b-8"
    @close="close(false)"
  >
    <template #body>
      <div
        data-testid="deck-settings__body"
        class="w-full flex flex-col items-center gap-6 sm:flex-row sm:gap-9 px-4"
      >
        <div class="relative flex w-min flex-col items-center pb-6">
          <cover-designer :cover-config="deck?.cover_config" />
        </div>

        <div class="w-full flex flex-col gap-5 items-start">
          <ui-input
            :placeholder="t('deck.title-placeholder')"
            text-align="center"
            size="lg"
            v-model:value="title"
          />
          <ui-input :placeholder="t('deck.description-placeholder')" v-model:value="description" />

          <ui-toggle v-model:checked="isPublic">
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
        <ui-button size="xl" @click="onSave" full-width>
          {{ deck ? t('common.save') : t('common.create') }}
        </ui-button>
      </div>
    </template>
  </mobile-sheet>
</template>
