<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import DeckHero from '@/views/deck/deck-hero.vue'
import ModeToolbar from './mode-toolbar/index.vue'
import CardEditor from './card-editor/index.vue'
import CardGrid from './card-grid/index.vue'
import CardImporter from './card-importer.vue'
import { useDeckQuery } from '@/api/decks'
import { useCardListController } from '@/composables/card-editor/card-list-controller'
import UiButton from '@/components/ui-kit/button.vue'
import { useI18n } from 'vue-i18n'
import {
  primeOverlayBelow,
  slideOverlayUp,
  slideOverlayDown
} from '@/utils/animations/deck-view/card-overlay'

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

const overlay_component = computed(() => {
  if (editor.mode.value === 'edit') return CardEditor
  if (editor.mode.value === 'import-export') return CardImporter
  return null
})

function onOverlayBeforeEnter(el: Element) {
  primeOverlayBelow(el)
}

function onOverlayEnter(el: Element, done: () => void) {
  slideOverlayUp(el, done)
}

function onOverlayLeave(el: Element, done: () => void) {
  slideOverlayDown(el, done)
}

const is_empty = computed(() => !editor.isLoading.value && editor.list.all_cards.value.length === 0)

const { prev_page_number, next_page_number } = editor.carousel
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
      class="md:h-full relative w-full grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr] gap-4 pb-4"
    >
      <mode-toolbar class="sm:col-start-2" />

      <ui-button
        data-testid="deck-view__previous-page-button"
        data-theme="brown-300"
        class="sm:col-start-1 sm:row-start-2 self-center max-sm:hidden! transition duration-300"
        :class="{ 'opacity-0 pointer-events-none': editor.mode.value !== 'view' }"
        icon-only
        icon-left="arrow-left"
        @click="editor.carousel.prevPage()"
      >
        {{ t('deck-view.actions.prev-page', { page: prev_page_number }) }}
      </ui-button>

      <div v-if="is_empty" data-testid="deck-view__empty" class="sm:row-start-2 sm:col-start-2" />
      <div
        v-else
        data-testid="deck-view__mode-stack"
        class="sm:row-start-2 sm:col-start-2 relative"
      >
        <card-grid
          class="transition-transform duration-300 ease-out"
          :class="{ 'scale-95': editor.mode.value !== 'view' }"
        />
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <Transition
            :css="false"
            mode="out-in"
            @before-enter="onOverlayBeforeEnter"
            @enter="onOverlayEnter"
            @leave="onOverlayLeave"
          >
            <component
              :is="overlay_component"
              v-if="overlay_component"
              class="size-full pointer-events-auto"
            />
          </Transition>
        </div>
      </div>

      <ui-button
        data-testid="deck-view__next-page-button"
        data-theme="brown-300"
        class="sm:row-start-2 self-center sm:col-start-3 max-sm:hidden! transition duration-300"
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
