<script setup lang="ts">
import UiLoader from '@/components/ui-kit/loader.vue'
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
