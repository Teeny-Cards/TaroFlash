<script setup lang="ts">
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import UiButton from '@/components/ui-kit/button.vue'
import SectionList from '@/components/layout-kit/section-list.vue'
import LabeledSection from '@/components/layout-kit/labeled-section.vue'
import { deckEditorKey } from '@/composables/deck-editor'

const { t } = useI18n()
const { deleting, resetting_reviews } = inject(deckEditorKey)!

const emit = defineEmits<{ delete: []; 'reset-reviews': [] }>()
</script>

<template>
  <section-list data-testid="tab-danger-zone">
    <labeled-section
      :label="t('deck.settings-modal.danger-zone.section.reset-heading')"
      :description="t('deck.settings-modal.danger-zone.section.reset-description')"
    >
      <ui-button
        data-testid="tab-danger-zone__reset-reviews-button"
        data-theme="red-500"
        data-theme-dark="stone-700"
        icon-left="schedule"
        full-width
        :loading="resetting_reviews"
        @click="emit('reset-reviews')"
      >
        {{ t('deck.settings-modal.danger-zone.reset-button') }}
      </ui-button>
    </labeled-section>

    <labeled-section
      :label="t('deck.settings-modal.danger-zone.section.delete-heading')"
      :description="t('deck.settings-modal.danger-zone.section.delete-description')"
    >
      <ui-button
        data-testid="tab-danger-zone__delete-button"
        data-theme="red-500"
        data-theme-dark="red-600"
        icon-left="delete"
        full-width
        :loading="deleting"
        @click="emit('delete')"
      >
        {{ t('deck.settings-modal.danger-zone.delete-button') }}
      </ui-button>
    </labeled-section>
  </section-list>
</template>
