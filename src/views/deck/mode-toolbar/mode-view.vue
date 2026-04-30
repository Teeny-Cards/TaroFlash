<script setup lang="ts">
import toolbarBase from './toolbar-base.vue'
import UiButton from '@/components/ui-kit/button.vue'
import UiTag from '@/components/ui-kit/tag.vue'
import { useI18n } from 'vue-i18n'
import { inject } from 'vue'
import { type CardListController } from '@/composables/card-editor/card-list-controller'

const { t } = useI18n()

const { list, carousel } = inject<CardListController>('card-editor')!
const { addCard } = list
const { page, total_pages, prev_page_number, next_page_number, prevPage, nextPage, can_paginate } =
  carousel
</script>

<template>
  <toolbar-base>
    <template #left>
      <ui-button
        data-testid="mode-view__search-button"
        data-theme="brown-300"
        data-theme-dark="stone-700"
        size="sm"
        icon-left="search"
        icon-only
      >
        {{ t('common.search') }}
      </ui-button>

      <ui-button
        data-testid="mode-view__add-card-button"
        data-theme="blue-500"
        data-theme-dark="blue-650"
        size="sm"
        icon-left="add"
        @click="addCard()"
      >
        {{ t('common.new-card') }}
      </ui-button>
    </template>

    <template #right>
      <div class="hidden md:flex items-center gap-2" data-testid="mode-view__pager">
        <ui-tag
          data-testid="mode-view__page-counter"
          data-theme="green-400"
          data-theme-dark="green-800"
          class="bgx-diagonal-stripes bgx-opacity-10"
        >
          {{ t('deck.mode-view.page-counter', { current: page + 1, total: total_pages }) }}
        </ui-tag>

        <ui-button
          data-testid="mode-view__previous-page-button"
          data-theme="brown-300"
          data-theme-dark="stone-700"
          icon-only
          size="sm"
          icon-left="arrow-left"
          :disabled="!can_paginate"
          @click="prevPage"
        >
          {{ t('deck-view.actions.prev-page', { page: prev_page_number }) }}
        </ui-button>

        <ui-button
          data-testid="mode-view__next-page-button"
          data-theme="brown-300"
          data-theme-dark="stone-700"
          icon-only
          size="sm"
          icon-left="arrow-right"
          :disabled="!can_paginate"
          @click="nextPage"
        >
          {{ t('deck-view.actions.next-page', { page: next_page_number }) }}
        </ui-button>
      </div>
    </template>
  </toolbar-base>
</template>
