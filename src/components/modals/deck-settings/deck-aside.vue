<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

type DeckAsideProps = {
  deck?: Deck
}

const { deck } = defineProps<DeckAsideProps>()

const { t, locale } = useI18n()

const card_count = computed(() => deck?.card_count ?? 0)

const title = computed(() => deck?.title || t('deck.title-placeholder'))

const owner = computed(
  () => deck?.member_display_name || t('deck.settings-modal.aside.owner-fallback')
)

const created_at = computed(() => {
  if (!deck?.created_at) return t('deck.settings-modal.aside.date-fallback')
  const d = new Date(deck.created_at)
  if (Number.isNaN(d.getTime())) return t('deck.settings-modal.aside.date-fallback')
  return new Intl.DateTimeFormat(locale.value, { month: 'short', year: 'numeric' }).format(d)
})
</script>

<template>
  <aside
    data-testid="deck-aside"
    class="h-full flex flex-col justify-between gap-5 text-brown-700 dark:text-brown-100"
  >
    <h2
      data-testid="deck-aside__title"
      class="text-center text-3xl font-semibold leading-tight truncate"
    >
      {{ title }}
    </h2>

    <div
      data-testid="deck-aside__meta"
      class="flex items-center justify-center gap-2 text-sm text-brown-500 dark:text-brown-300"
    >
      <span data-testid="deck-aside__owner">{{ owner }}</span>
      <span aria-hidden="true">·</span>
      <span data-testid="deck-aside__created-at">{{ created_at }}</span>
    </div>
  </aside>
</template>
