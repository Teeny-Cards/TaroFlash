<template>
  <nav class="w-full bg-blue font-primary sticky top-0 z-10 flex justify-center px-4 py-3">
    <div class="w-full max-w-app flex justify-between items-center">
      <RouterLink to="/dashboard" class="text-2xl text-white">TeenyCards</RouterLink>
      <div class="flex gap-3 items-center">
        <!-- <RouterLink to="/dashboard" class="text-white">Dashboard</RouterLink> -->
        <RouterLink to="/create" class="text-white">Create</RouterLink>
        <p class="text-white">{{ display_name }}</p>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const props = defineProps({
  display_name: String
})
</script>
