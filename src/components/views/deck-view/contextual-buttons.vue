<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  mode: 'edit' | 'view' | 'select'
  isDirty: boolean
  allSelected?: boolean
}>()

const emit = defineEmits<{
  (e: 'cancelled'): void
  (e: 'saved'): void
  (e: 'edit'): void
  (e: 'all-selected'): void
}>()

const { t } = useI18n()
</script>

<template>
  <div v-if="mode === 'edit'" class="flex gap-1.5">
    <ui-kit:button icon-left="close" variant="danger" @click="emit('cancelled')">
      {{ t('common.cancel') }}
    </ui-kit:button>

    <ui-kit:button icon-left="check" @click="emit('saved')" :disabled="!isDirty">
      {{ t('common.save') }}
    </ui-kit:button>
  </div>

  <div v-else-if="mode === 'select'" class="flex gap-1.5">
    <ui-kit:button icon-left="close" variant="danger" @click="emit('cancelled')">
      {{ t('common.cancel') }}
    </ui-kit:button>
    <ui-kit:radio :checked="allSelected" @click="emit('all-selected')" />
  </div>

  <ui-kit:button v-else icon-left="edit" @click="emit('edit')">
    {{ t('common.edit') }}
  </ui-kit:button>
</template>
