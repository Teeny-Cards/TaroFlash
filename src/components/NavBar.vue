<template>
  <nav class="w-full bg-cyan-400 flex justify-between items-center px-6 py-3">
    <RouterLink to="/">Tiny Cards</RouterLink>
    <div class="flex gap-3 items-center">
      <RouterLink to="/create">Create</RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
