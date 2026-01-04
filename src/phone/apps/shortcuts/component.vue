<script setup lang="ts">
import { ref } from 'vue'
import UiLoader from '@/components/ui-kit/loader.vue'

const opening = ref(true)
</script>

<template>
  <ui-loader
    loading-image="shortcuts"
    done-image="shortcuts-hover"
    theme="orange"
    class="rounded-[inherit]"
  >
    <div class="w-full h-full bg-white rounded-[inherit]"></div>
  </ui-loader>
</template>
