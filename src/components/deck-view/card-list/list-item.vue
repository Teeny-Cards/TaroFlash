<script lang="ts" setup>
import Card from '@/components/card.vue'

defineProps<{ card: Card }>()
</script>

<template>
  <div
    data-testid="card-list__item"
    class="text-grey-700 grid w-full cursor-pointer grid-cols-[auto_1fr_1fr_auto] items-center gap-6 py-3"
  >
    <card size="2xs" />
    <p>{{ card.front_text }}</p>
    <p>{{ card.back_text }}</p>
    <ui-kit:button icon-only variant="muted" size="small">
      <ui-kit:icon src="more" />
    </ui-kit:button>
  </div>
</template>
