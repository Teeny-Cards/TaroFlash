<script setup lang="ts">
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import UiInput from '@/components/ui-kit/input.vue'
import UiToggle from '@/components/ui-kit/toggle.vue'
import UiIcon from '@/components/ui-kit/icon.vue'
import SectionList from '@/components/layout-kit/section-list.vue'
import LabeledSection from '@/components/layout-kit/labeled-section.vue'
import { deckEditorKey } from '@/composables/deck-editor'

const { t } = useI18n()
const { settings } = inject(deckEditorKey)!
</script>

<template>
  <section-list data-testid="tab-general">
    <labeled-section :label="t('deck.settings-modal.general.section.details-heading')">
      <ui-input
        :placeholder="t('deck.title-placeholder')"
        text-align="center"
        size="lg"
        v-model:value="settings.title"
      />
      <ui-input
        :placeholder="t('deck.description-placeholder')"
        v-model:value="settings.description"
      />
    </labeled-section>

    <labeled-section :label="t('deck.settings-modal.general.section.visibility-heading')">
      <ui-toggle v-model:checked="settings.is_public">
        <div class="flex items-center gap-2.5">
          <ui-icon src="public" />
          {{ t('deck.settings-modal.is-public') }}
        </div>
      </ui-toggle>
    </labeled-section>
  </section-list>
</template>
