<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import DeckHero from '@/views/deck/deck-hero.vue'
import ModeToolbar from './mode-toolbar/index.vue'
import CardEditor from './card-editor/index.vue'
import CardGrid from './card-grid/index.vue'
import CardImporter from './card-importer.vue'
import { useDeckQuery } from '@/api/decks'
import { useCardListController } from '@/composables/card-editor/card-list-controller'
import UiButton from '@/components/ui-kit/button.vue'
import { useI18n } from 'vue-i18n'

const { id: deck_id } = defineProps<{
  id: string
}>()

const { t } = useI18n()

const image_url = ref<string | undefined>()

const deck_query = useDeckQuery(() => Number(deck_id))
const deck = deck_query.data

const editor = useCardListController({
  deck_id: Number(deck_id)
})

provide('card-editor', editor)

const mode_components: { [key in CardEditorMode]: any } = {
  view: CardGrid,
  edit: CardEditor,
  'import-export': CardImporter
}

const is_empty = computed(() => !editor.isLoading.value && editor.list.all_cards.value.length === 0)

const prev_page_number = computed(() => {
  const { page, total_pages } = editor.carousel
  return page.value === 0 ? total_pages.value : page.value
})

const next_page_number = computed(() => {
  const { page, total_pages } = editor.carousel
  return page.value === total_pages.value - 1 ? 1 : page.value + 2
})
</script>

<template>
  <section
    data-testid="deck-view"
    class="flex md:h-full flex-col xl:flex-row items-center xl:items-start gap-6 md:gap-15"
  >
    <deck-hero
      v-if="deck"
      class="xl:sticky top-(--nav-height)"
      :deck="deck"
      :image-url="image_url"
    />

    <div
      class="md:h-full relative w-full grid grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr] gap-4 pb-4"
    >
      <mode-toolbar class="col-start-2" />

      <ui-button
        data-theme="brown-300"
        class="col-start-1 row-start-2 self-center"
        :class="{ 'opacity-0 pointer-events-none': editor.mode.value !== 'view' }"
        icon-only
        icon-left="arrow-left"
        @click="editor.carousel.prevPage()"
      >
        {{ t('deck-view.actions.prev-page', { page: prev_page_number }) }}
      </ui-button>

      <div v-if="is_empty" data-testid="deck-view__empty" class="row-start-2 col-start-2" />
      <component v-else :is="mode_components[editor.mode.value]" class="row-start-2 col-start-2" />

      <ui-button
        data-theme="brown-300"
        class="row-start-2 self-center col-start-3"
        :class="{ 'opacity-0 pointer-events-none': editor.mode.value !== 'view' }"
        icon-only
        icon-left="arrow-right"
        @click="editor.carousel.nextPage()"
      >
        {{ t('deck-view.actions.next-page', { page: next_page_number }) }}
      </ui-button>
    </div>
  </section>
</template>
