<template>
  <header>
    <nav class="w-full bg-cyan-400 flex justify-between items-center px-6 py-3">
      <h2>Tiny Cards</h2>
      <div class="flex gap-3 items-center">
        <RouterLink to="/">Create</RouterLink>
      </div>
    </nav>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
