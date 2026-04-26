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

const { id: deck_id } = defineProps<{
  id: string
}>()

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

function onToggleEditCards() {
  if (editor.mode.value === 'edit') {
    editor.setMode('view')
  } else {
    editor.setMode('edit')
  }
}
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
      :mode="editor.mode.value"
      @toggle-edit-cards="onToggleEditCards"
    />

    <div class="md:h-full relative flex w-full flex-col items-center gap-4">
      <mode-toolbar />
      <div v-if="is_empty" data-testid="deck-view__empty" />
      <component v-else :is="mode_components[editor.mode.value]" />
    </div>
  </section>
</template>
