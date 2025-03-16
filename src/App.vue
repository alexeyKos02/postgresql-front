<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { PageName } from './styles';
import ToolbarComponent from './components/ToolbarComponent.vue';

const router = useRouter();

onMounted(() => {
  router.push({ name: PageName.Main });
});
</script>

<template>
  <ToolbarComponent />
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
