<script setup lang="ts">
import { computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import TabDesign from './tab-design/index.vue'
import TabGeneral from './tab-general/index.vue'
import TabStudy from './tab-study/index.vue'
import TabDangerZone from './tab-danger-zone/index.vue'
import DeckPreview from './deck-preview.vue'
import DeckAside from './deck-aside.vue'
import { useDeckEditor, deckEditorKey } from '@/composables/deck-editor'
import { useSessionRef } from '@/composables/use-session-ref'
import { useAlert } from '@/composables/alert'
import { useToast } from '@/composables/toast'
import UiButton from '@/components/ui-kit/button.vue'
import TabSheet from '@/components/layout-kit/modal/tab-sheet.vue'

export type DeckSettingsResponse = boolean

const { deck, close } = defineProps<{
  deck?: Deck
  close: (response?: DeckSettingsResponse) => void
}>()

const { t } = useI18n()
const alert = useAlert()
const toast = useToast()
const router = useRouter()
const route = useRoute()

const editor = useDeckEditor(deck)
provide(deckEditorKey, editor)

const tabs = computed(() => {
  const base = [
    { value: 'general', icon: 'label', label: t('deck.settings-modal.tab.general') },
    { value: 'design', icon: 'design-services', label: t('deck.settings-modal.tab.design') },
    { value: 'study', icon: 'school-cap', label: t('deck.settings-modal.tab.study') }
  ]
  if (deck?.id) {
    base.push({
      value: 'danger-zone',
      icon: 'delete',
      label: t('deck.settings-modal.tab.danger-zone')
    })
  }
  return base
})

const active_tab = useSessionRef('deck-settings.active-tab', 'general')

// New decks always start on the general tab — the persisted value from a
// prior edit session shouldn't carry across to a create flow. For edits,
// clamp any stale value (e.g. 'danger-zone' that doesn't exist this open)
// back to the first tab.
if (!deck?.id) {
  active_tab.value = 'general'
} else if (!tabs.value.some((tab) => tab.value === active_tab.value)) {
  active_tab.value = tabs.value[0].value
}

const active_header = computed(() => ({
  title: t(`deck.settings-modal.header.${active_tab.value}.title`),
  description: t(`deck.settings-modal.header.${active_tab.value}.description`)
}))

const visible_side = computed(() =>
  active_tab.value === 'design' ? editor.active_side.value : 'cover'
)

function onPreviewSide(side: CardSide) {
  if (active_tab.value !== 'design') return
  editor.setActiveSide(side)
}

async function onSave() {
  const saved = await editor.saveDeck()
  if (saved) close(true)
}

async function onResetReviews() {
  const confirmed = await alert.warn({
    title: t('alert.reset-reviews.title'),
    message: t('alert.reset-reviews.message'),
    confirmLabel: t('alert.reset-reviews.confirm')
  }).response
  if (!confirmed) return

  const ok = await editor.resetReviews()
  if (!ok) {
    toast.error(t('toast.error.reset-reviews-failed'))
    return
  }
  toast.success(t('toast.success.reset-reviews'))
}

async function onDelete() {
  const confirmed = await alert.warn({
    title: t('alert.delete-deck.title'),
    message: t('alert.delete-deck.message'),
    confirmLabel: t('alert.delete-deck.confirm'),
    confirmAudio: 'ui.trash_crumple_short'
  }).response
  if (!confirmed) return

  const ok = await editor.deleteDeck()
  if (!ok) {
    toast.error(t('toast.error.deck-delete-failed'))
    return
  }

  close(true)

  // Only navigate away if the user is currently viewing the deleted deck.
  // Opening settings from anywhere else (e.g. dashboard) shouldn't yank
  // them out of their current view.
  const on_deleted_deck = route.name === 'deck' && Number(route.params.id) === deck?.id
  if (on_deleted_deck) router.push({ name: 'dashboard' })
}
</script>

<template>
  <tab-sheet
    data-testid="deck-settings-container"
    data-theme="green-500"
    data-theme-dark="green-800"
    class="sm:w-245 sm:h-167"
    :tabs="tabs"
    :cover_config="{ pattern: 'endless-clouds' }"
    :parts="{ content: 'flex gap-6 h-full items-start' }"
    hover_sfx="ui.click_07"
    v-model:active="active_tab"
    @close="close(false)"
  >
    <template #header-content>
      <div data-testid="deck-settings__header" class="w-full flex flex-col">
        <h1 data-testid="deck-settings__header-title" class="text-5xl text-white">
          {{ active_header.title }}
        </h1>
        <p data-testid="deck-settings__header-description" class="text-white/80">
          {{ active_header.description }}
        </p>
      </div>
    </template>

    <div data-testid="deck-settings__main" class="flex flex-1 flex-col gap-4 min-w-0">
      <tab-design v-if="active_tab === 'design'" />
      <tab-general v-else-if="active_tab === 'general'" />
      <tab-study v-else-if="active_tab === 'study'" />
      <tab-danger-zone
        v-else-if="active_tab === 'danger-zone'"
        @delete="onDelete"
        @reset-reviews="onResetReviews"
      />
    </div>

    <deck-aside
      data-testid="deck-settings__aside"
      :deck="deck"
      class="w-78.5 shrink-0 self-end pt-60"
    />

    <template #overlay>
      <deck-preview
        :deck_id="deck?.id"
        :cover="editor.cover"
        :card_attributes="editor.card_attributes"
        :side="visible_side"
        @update:side="onPreviewSide"
      />
    </template>

    <template #footer>
      <ui-button
        v-if="editor.is_dirty.value"
        data-theme="blue-500"
        data-theme-dark="blue-650"
        size="xl"
        full-width
        @click="onSave"
      >
        {{ deck ? t('deck.settings-modal.submit-edit') : t('deck.settings-modal.submit-create') }}
      </ui-button>
    </template>
  </tab-sheet>
</template>
