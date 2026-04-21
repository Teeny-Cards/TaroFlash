<script setup lang="ts">
import OverviewPanel from '@/views/deck/overview-panel.vue'
import { ref, provide } from 'vue'
import { useDeckQuery } from '@/api/decks'
import CardEditor from './card-editor/index.vue'
import CardGrid from './card-grid/index.vue'
import CardImporter from './card-importer.vue'
import { useI18n } from 'vue-i18n'
import { useCardListController } from '@/composables/card-list-controller'
import UiScrollBar from '@/components/ui-kit/scroll-bar.vue'
import UiTabs from '@/components/ui-kit/tabs.vue'
import UiButton from '@/components/ui-kit/button.vue'
import BulkSelectToolbar from '@/views/deck/bulk-select-toolbar.vue'
import { useMediaQuery } from '@/composables/use-media-query'

const { id: deck_id } = defineProps<{
  id: string
}>()

const { t } = useI18n()
const is_md = useMediaQuery('md')

const image_url = ref<string | undefined>()
const active_tab = ref(0)

const deck_query = useDeckQuery(() => Number(deck_id))
const deck = deck_query.data

const editor = useCardListController({
  deck_id: Number(deck_id),
  deck_query
})

provide('card-editor', editor)

const tabs = [
  {
    label: t('deck-view.tabs.card-view'),
    icon: 'teeny-cards'
  },
  {
    label: t('deck-view.tabs.edit-cards'),
    icon: 'edit'
  },
  {
    label: t('deck-view.tabs.import-cards'),
    icon: 'arrow-circle-up'
  }
]

const tab_components: { [key: number]: any } = {
  0: CardGrid,
  1: CardEditor,
  2: CardImporter
}
</script>

<template>
  <section
    data-testid="deck-view"
    class="flex h-full flex-col xl:flex-row items-center xl:items-start gap-6 md:gap-15 pb-24"
  >
    <overview-panel
      v-if="deck"
      class="xl:sticky top-(--nav-height)"
      :deck="deck"
      :image-url="image_url"
      @updated="deck_query.refetch()"
    />

    <div class="relative flex h-full w-full flex-col items-center">
      <div
        data-testid="deck-view__action-bar"
        class="sticky top-(--nav-height) hidden z-10 md:flex max-w-208 w-full xl:max-w-full justify-between pb-2"
      >
        <ui-tabs :tabs="tabs" v-model:activeTab="active_tab" storage-key="deck-view-tabs" />

        <div class="flex items-center gap-4 text-brown-700 dark:text-brown-300">
          <p v-if="editor.saving.value">Saving...</p>
          <p v-else>Saved</p>

          <ui-button
            v-if="editor.mode.value === 'select'"
            @click="editor.onCancel"
            icon-left="close"
            theme="grey-400"
          >
            {{ t('common.cancel') }}
          </ui-button>
        </div>

        <div
          class="bg-brown-100 dark:bg-grey-900 border-b-brown-500 absolute -top-10 right-0 left-0 sm:-right-3 bottom-0 sm:-left-3 -z-10 border-b"
        ></div>
      </div>

      <component :is="is_md ? tab_components[active_tab] : CardGrid">
        <bulk-select-toolbar
          @cancel="editor.onCancel"
          @move="editor.onMoveCards"
          @delete="editor.onDeleteCards"
        />
      </component>
    </div>

    <ui-scroll-bar target="html" />
  </section>
</template>
