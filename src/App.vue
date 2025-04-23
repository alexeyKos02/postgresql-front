<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterView, useRouter, useRoute } from 'vue-router';
import ToolbarComponent from './components/ToolbarComponent.vue';
import GlobalLoader from './components/GlobalLoader.vue';
import { useRenderStore } from '@/stores';

const store = useRenderStore();
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  try {
    store.isLoading = true;
    await store.fetchWorkspaces();
  } finally {
    store.isLoading = false;
  }
});
</script>

<template>
  <!-- Показываем тулбар только если НЕ login -->
  <ToolbarComponent v-if="route.path !== '/login'" />
  <GlobalLoader />
  <RouterView />
</template>

<style>
* {
  box-sizing: border-box;
}
html {
  font-size: 16px;
}
body {
  display: block;
  font-family: 'Duepun', sans-serif;
  margin: 0;
}
#app {
  display: flex;
  height: 100vh;
  width: 100vw;
}
</style>
