<script setup lang="ts">
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import UiInput from '@/components/ui-kit/input.vue'
import SectionList from '@/components/layout-kit/section-list.vue'
import LabeledSection from '@/components/layout-kit/labeled-section.vue'
import MemberCard from '@/components/member/member-card.vue'
import { memberEditorKey } from '@/composables/member-editor'
import { useMobileBreakpoint } from '@/composables/use-media-query'

const { t } = useI18n()
const editor = inject(memberEditorKey)!
const is_mobile = useMobileBreakpoint('md')
</script>

<template>
  <section-list data-testid="tab-profile">
    <labeled-section
      v-if="is_mobile"
      data-testid="tab-profile__preview"
      :label="t('settings.profile.section.preview')"
    >
      <member-card
        :created-at="editor.created_at.value"
        :display-name="editor.settings.display_name"
        :card-comment="editor.settings.description"
        :card-title="t('settings.preview.title-fallback')"
        :cover="editor.cover"
        class="mx-auto"
      />
    </labeled-section>

    <labeled-section :label="t('settings.profile.section.identity')">
      <ui-input
        :label="t('settings.profile.member-name-label')"
        v-model:value="editor.settings.display_name"
      />
      <ui-input
        :label="t('settings.profile.description-label')"
        :placeholder="t('settings.profile.description-placeholder')"
        v-model:value="editor.settings.description"
      />
      <div data-testid="tab-profile__email" class="flex flex-col gap-1.5">
        <span class="text-brown-500 dark:text-brown-300">
          {{ t('settings.profile.email-label') }}
        </span>
        <span class="text-brown-700 dark:text-brown-100">{{ editor.email.value }}</span>
      </div>
    </labeled-section>
  </section-list>
</template>
