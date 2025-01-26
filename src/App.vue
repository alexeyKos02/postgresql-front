<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { PageName } from './styles'

const router = useRouter()

onMounted(() => {
  // router.push({ name: PageName.Main })
})
</script>

<template>
  <RouterView />
</template>

<style>
* {
  box-sizing: border-box;
}
html {
  font-size: 16px; /* Базовый размер */
}
body {
  font-family: 'Duepun', sans-serif;
  /* font-family: Flame, sans-serif; */
}
#app {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
