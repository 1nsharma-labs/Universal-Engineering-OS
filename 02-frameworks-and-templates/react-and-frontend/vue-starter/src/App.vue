<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
const title = 'Universal Vue 3 + Composition API';
</script>

<template>
  <div style="font-family: sans-serif; padding: 2rem; background: #0f172a; color: white; min-height: 100vh;">
    <h1>{{ title }}</h1>
    <p>Modern reactive component architecture with Vite and TypeScript.</p>
    <button
      @click="count++"
      style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;"
    >
      Reactive Counter: {{ count }}
    </button>
  </div>
</template>
