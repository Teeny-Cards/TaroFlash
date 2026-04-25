<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import DeckHero from '@/views/deck/deck-hero.vue'
import ModeToolbar from './mode-toolbar/index.vue'
import CardEditor from './card-editor/index.vue'
import CardGrid from './card-grid/index.vue'
import CardImporter from './card-importer.vue'
import { useDeckQuery } from '@/api/decks'
import {
  useCardListController,
  type CardEditorMode
} from '@/composables/card-editor/card-list-controller'
import UiScrollBar from '@/components/ui-kit/scroll-bar.vue'
import { useMediaQuery } from '@/composables/use-media-query'

const { id: deck_id } = defineProps<{
  id: string
}>()

const is_md = useMediaQuery('md')

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

const is_empty = computed(() => !editor.isLoading.value && editor.all_cards.value.length === 0)
</script>

<template>
  <section
    data-testid="deck-view"
    class="flex h-full flex-col xl:flex-row items-center xl:items-start gap-6 md:gap-15 pb-24"
  >
    <deck-hero
      v-if="deck"
      class="xl:sticky top-(--nav-height)"
      :deck="deck"
      :image-url="image_url"
      @updated="deck_query.refetch()"
    />

    <div class="relative flex h-full w-full flex-col items-center">
      <mode-toolbar :mode="editor.mode.value" />
      <div v-if="is_empty" data-testid="deck-view__empty" />
      <component v-else :is="is_md ? mode_components[editor.mode.value] : CardGrid" />
    </div>

    <ui-scroll-bar target="html" />
  </section>
</template>
