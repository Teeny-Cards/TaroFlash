<script lang="ts" setup>
import UiButton from '@/components/ui-kit/button.vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'select'): void
  (e: 'move'): void
  (e: 'delete'): void
}>()

const { t } = useI18n()
</script>

<template>
  <div class="grid grid-cols-1 gap-2">
    <ui-button
      @click.stop="emit('select')"
      icon-only
      icon-left="data-check"
      theme="brown-100"
      :sfx="{ hover: 'ui.pop_drip_mid' }"
    >
      {{ t('deck-view.item-options.select') }}
    </ui-button>

    <ui-button
      @click.stop="emit('move')"
      icon-only
      icon-left="move-item"
      theme="brown-100"
      :sfx="{ hover: 'ui.pop_drip_mid' }"
    >
      {{ t('deck-view.item-options.move') }}
    </ui-button>

    <ui-button
      @click.stop="emit('delete')"
      icon-only
      icon-left="delete"
      theme="red-500"
      :sfx="{ hover: 'ui.pop_drip_mid' }"
    >
      {{ t('deck-view.item-options.delete') }}
    </ui-button>
  </div>
</template>
