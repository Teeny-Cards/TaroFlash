<script setup lang="ts">
import { fetchMemberDecks } from '@/api/decks'
import { computed, onMounted, ref } from 'vue'
import Card from '@/components/card/index.vue'
import { useI18n } from 'vue-i18n'
import { useAudio } from '@/composables/audio'
import UiListItem from '@/components/ui-kit/list-item.vue'
import UiRadio from '@/components/ui-kit/radio.vue'
import UiButton from '@/components/ui-kit/button.vue'

export type MoveCardsModalResponse = {
  deck_id: number
}

const { cards, current_deck_id, close } = defineProps<{
  cards: Card[]
  current_deck_id: number
  close: (response?: MoveCardsModalResponse | boolean) => void
}>()

const { t } = useI18n()
const audio = useAudio()

const decks = ref<Deck[]>([])
const selected_deck_id = ref<number | undefined>(undefined)

const title = computed(() => {
  return t('move-cards-modal.title', {
    count: cards.length,
    front: cards[0]?.front_text ?? '...',
    back: cards[0]?.back_text ?? '...'
  })
})

onMounted(async () => {
  decks.value = await fetchMemberDecks()
})

async function onMove() {
  if (!selected_deck_id.value) return
  close({ deck_id: selected_deck_id.value })
}

function onClick(deck_id?: number) {
  audio.play('etc_camera_shutter')

  if (deck_id === selected_deck_id.value) {
    selected_deck_id.value = undefined
    return
  }

  selected_deck_id.value = deck_id
}
</script>

<template>
  <div data-testid="move-cards-container">
    <div
      data-testid="move-cards"
      class="bg-brown-300 rounded-8 overflow-hidden min-w-100 drop-shadow-modal"
    >
      <div
        data-testid="move-cards__header"
        class="px-8 py-10 bg-purple-500 wave-bottom-sm bg-(image:--endless-clouds) flex items-center justify-center"
      >
        <h1 class="move-cards__title" v-html="title"></h1>
      </div>

      <div data-testid="move-cards__deck-list" class="px-8 pt-4 pb-12 flex flex-col">
        <ui-list-item
          v-for="(deck, index) in decks"
          :key="index"
          :disabled="deck.id === current_deck_id"
          appearance="fill"
          class="cursor-pointer"
          @click="onClick(deck.id)"
        >
          <template #before>
            <card size="2xs" />
          </template>

          {{ deck.title }}

          <template #after>
            <ui-radio
              :checked="deck.id === selected_deck_id"
              @click.stop="selected_deck_id = deck.id"
            />
          </template>
        </ui-list-item>
      </div>
    </div>

    <div
      data-testid="move-cards__actions"
      class="absolute -bottom-3 flex w-full justify-end gap-3 px-8"
    >
      <ui-button
        data-testid="move-cards__cancel"
        theme="grey"
        icon-left="close"
        @click="close(false)"
        class="ring-brown-300 ring-7"
      >
        {{ t('common.cancel') }}
      </ui-button>

      <ui-button
        data-testid="move-cards__move"
        icon-left="arrow-forward"
        @click="onMove"
        :disabled="!selected_deck_id"
        class="ring-brown-300 ring-7"
      >
        {{ t('common.move') }}
      </ui-button>
    </div>
  </div>
</template>

<style>
.move-cards__title {
  color: var(--color-white);
  font-size: var(--text-4xl);
  vertical-align: middle;
}

.move-cards__title span {
  background-color: var(--color-white);
  padding: 4px 6px;

  max-width: 200px;
  min-width: 20px;

  font-size: var(--text-2xl);
  vertical-align: inherit;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  color: var(--color-purple-500);
}

.move-cards__title span:first-child {
  border-radius: 8px 2px 2px 8px;
  margin-right: 4px;
}
.move-cards__title span:last-child {
  border-radius: 2px 8px 8px 2px;
}
</style>
