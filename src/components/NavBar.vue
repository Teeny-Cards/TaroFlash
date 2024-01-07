<template>
  <nav class="w-full bg-green-400">
    <div class="w-full max-w-screen-xl mx-auto px-8 py-3 flex justify-between items-center">
      <RouterLink to="/dashboard" class="text-xl font-semibold text-white">Teeny Cards</RouterLink>
      <div class="flex gap-3 items-center">
        <RouterLink to="/dashboard" class="text-white">Dashboard</RouterLink>
        <RouterLink to="/create" class="text-white">Create</RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
