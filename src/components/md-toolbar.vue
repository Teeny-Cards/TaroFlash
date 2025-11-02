<script setup lang="ts">
import { useMdEditor } from '@/composables/md-editor'

const { activeEl, bold, italic, header, link, color, align, context } = useMdEditor()

function onChangeHeading(e: Event) {
  const v = (e.target as HTMLSelectElement).value as 'p' | 'h1' | 'h2' | 'h3'
  header(v)
}
</script>

<template>
  <div
    data-testid="md-toolbar"
    class="fixed bottom-6 bg-white rounded-6 shadow-popover p-3 pr-6 flex justify-center items-center gap-4
      transition-transform duration-100 ease-in-out"
    :class="{ 'transform translate-y-20': !activeEl }"
    @mousedown.prevent
  >
    <button :class="{ active: context.bold }" @click="bold"><b>B</b></button>
    <button :class="{ active: context.italic }" @click="italic"><i>I</i></button>

    <select :value="context.block" @change="onChangeHeading">
      <option value="p">Paragraph</option>
      <option value="h1">H1</option>
      <option value="h2">H2</option>
      <option value="h3">H3</option>
      <option value="mixed" disabled>— mixed —</option>
    </select>

    <button :class="{ active: context.link }" @click="link()">Link</button>

    <!-- optional: show current colors -->
    <select
      :value="context.color ?? ''"
      @change="color({ c: ($event.target as HTMLSelectElement).value || undefined })"
    >
      <option value="">Text</option>
      <option value="accent">Accent</option>
      <option value="success">Success</option>
      <option value="warning">Warning</option>
      <option value="danger">Danger</option>
    </select>
    <select
      :value="context.bg ?? ''"
      @change="color({ bg: ($event.target as HTMLSelectElement).value || undefined })"
    >
      <option value="">BG</option>
      <option value="surface">Surface</option>
      <option value="brand">Brand</option>
    </select>

    <select
      :value="context.align ?? ''"
      @change="align(($event.target as HTMLSelectElement).value as any)"
    >
      <option value="">Align</option>
      <option value="left">Left</option>
      <option value="center">Center</option>
      <option value="right">Right</option>
      <option value="justify">Justify</option>
    </select>
  </div>
</template>

<style scoped>
.sep {
  width: 1px;
  background: var(--ui-surface-2);
  margin: 0 4px;
}
</style>
