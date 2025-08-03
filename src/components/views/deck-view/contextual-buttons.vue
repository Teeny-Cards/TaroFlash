<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  mode: 'edit' | 'view' | 'select'
  isDirty: boolean
  allSelected?: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel-edit'): void
  (e: 'save-edit'): void
  (e: 'edit'): void
  (e: 'select-all'): void
}>()

const { t } = useI18n()
</script>

<template>
  <div v-if="mode === 'edit'" class="flex gap-1.5">
    <ui-kit:button icon-left="close" variant="danger" @click="emit('cancel-edit')">
      {{ t('common.cancel') }}
    </ui-kit:button>

    <ui-kit:button icon-left="check" @click="emit('save-edit')" :disabled="!isDirty">
      {{ t('common.save') }}
    </ui-kit:button>
  </div>

  <div v-else-if="mode === 'select'">
    <ui-kit:radio :selected="allSelected" @change="emit('select-all')" />
  </div>

  <ui-kit:button v-else icon-left="edit" @click="emit('edit')">
    {{ t('common.edit') }}
  </ui-kit:button>
</template>
