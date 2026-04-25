<script setup lang="ts">
import toolbarBase from './toolbar-base.vue'
import UiButton from '@/components/ui-kit/button.vue'
import UiTag from '@/components/ui-kit/tag.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <toolbar-base>
    <template #left>
      <ui-button
        data-testid="mode-view__search-button"
        data-theme="brown-300"
        data-theme-dark="grey-800"
        size="xs"
        icon-left="search"
        icon-only
      >
        {{ t('common.search') }}
      </ui-button>

      <ui-button
        data-testid="mode-view__add-card-button"
        data-theme="blue-500"
        data-theme-dark="blue-650"
        size="xs"
        icon-left="add"
      >
        {{ t('common.new-card') }}
      </ui-button>
    </template>

    <template #right>
      <ui-tag
        data-testid="mode-view__page-counter"
        data-theme="green-400"
        data-theme-dark="green-800"
        class="bgx-diagonal-stripes dark:bgx-opacity-10"
        >Page 1/10</ui-tag
      >

      <ui-button
        data-testid="mode-view__previous-page-button"
        data-theme="brown-300"
        data-theme-dark="grey-800"
        icon-only
        size="xs"
        icon-left="arrow-left"
      >
        {{ t('common.previous') }}
      </ui-button>

      <ui-button
        data-testid="mode-view__next-page-button"
        data-theme="brown-300"
        data-theme-dark="grey-800"
        icon-only
        size="xs"
        icon-left="arrow-right"
      >
        {{ t('common.next') }}
      </ui-button>
    </template>
  </toolbar-base>
</template>
