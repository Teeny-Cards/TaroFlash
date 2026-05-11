<script setup lang="ts">
import { provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import DeckPreview from '@/components/deck/deck-preview.vue'
import CoverDesigner from '@/components/deck/cover-designer/index.vue'
import { useDeckEditor, deckEditorKey } from '@/composables/deck-editor'
import { randomCoverConfig } from '@/utils/cover'
import UiButton from '@/components/ui-kit/button.vue'
import UiInput from '@/components/ui-kit/input.vue'
import LabeledSection from '@/components/layout-kit/labeled-section.vue'
import MobileSheet from '@/components/layout-kit/modal/mobile-sheet.vue'

export type DeckCreateResponse = boolean

const { close } = defineProps<{
  close: (response?: DeckCreateResponse) => void
}>()

const { t } = useI18n()
const router = useRouter()

const editor = useDeckEditor({ cover_config: randomCoverConfig() } as Deck)
provide(deckEditorKey, editor)

async function onSave() {
  const saved = await editor.saveDeck()
  if (!saved) return
  close(true)
  router.push({ name: 'deck', params: { id: saved.id } })
}
</script>

<template>
  <mobile-sheet
    data-testid="deck-create-container"
    data-theme="green-500"
    data-theme-dark="green-800"
    class="sm:w-200"
    :title="t('deck.create-modal.title')"
    :pattern_config="{ pattern: 'endless-clouds' }"
    @close="close(false)"
  >
    <div data-testid="deck-create__body" class="grid grid-cols-[auto_1fr] items-start gap-6 p-6">
      <div data-testid="deck-create__left" class="flex flex-col gap-6">
        <deck-preview
          data-testid="deck-create__preview"
          :cover="editor.cover"
          :card_attributes="editor.card_attributes"
          side="cover"
        />

        <labeled-section :label="t('deck.create-modal.details-heading')">
          <ui-input
            :placeholder="t('deck.title-placeholder')"
            text-align="center"
            size="lg"
            v-model:value="editor.settings.title"
          />
          <ui-input
            :placeholder="t('deck.description-placeholder')"
            v-model:value="editor.settings.description"
          />
        </labeled-section>
      </div>

      <div data-testid="deck-create__right" class="h-full flex flex-col justify-between gap-6">
        <cover-designer :config="editor.cover" />

        <div data-testid="deck-create__actions" class="flex gap-3">
          <ui-button
            data-theme="grey-400"
            icon-left="close"
            size="lg"
            full-width
            @click="close(false)"
          >
            {{ t('deck.create-modal.cancel') }}
          </ui-button>

          <ui-button
            data-theme="blue-500"
            data-theme-dark="blue-650"
            icon-left="add"
            size="lg"
            full-width
            @click="onSave"
          >
            {{ t('deck.create-modal.submit') }}
          </ui-button>
        </div>
      </div>
    </div>
  </mobile-sheet>
</template>
