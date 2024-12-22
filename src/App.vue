<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { PageName } from './styles'

const router = useRouter()

onMounted(() => {
  router.push({ name: PageName.Login })
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
  font-family: Flame, sans-serif;
}
</style>
