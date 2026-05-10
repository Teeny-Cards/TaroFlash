<script setup lang="ts">
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import UiButton from '@/components/ui-kit/button.vue'
import SectionList from '@/components/layout-kit/section-list.vue'
import LabeledSection from '@/components/layout-kit/labeled-section.vue'
import { deckEditorKey } from '@/composables/deck-editor'

const { t } = useI18n()
const { deleting } = inject(deckEditorKey)!

const emit = defineEmits<{ delete: [] }>()
</script>

<template>
  <section-list data-testid="tab-danger-zone">
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
