<script setup lang="ts">
import { ref } from 'vue'
import UiLoader from '@/components/ui-kit/loader.vue'

const opening = ref(true)
</script>

<template>
  <div class="w-full h-full rounded-[inherit] overflow-hidden">
    <ui-loader image="shortcuts" size="lg" theme="orange" />
  </div>
</template>
