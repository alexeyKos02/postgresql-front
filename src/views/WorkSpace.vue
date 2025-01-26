<script lang="ts" setup>
import LeftMenu from '@/components/LeftMenu.vue'
import RightComponent from '@/components/RightComponent.vue'
import ClusterInfo from '@/components/module/pages/ClusterInfo.vue'
</script>

<template>
  <div class="container">
    <div class="element element-1"><LeftMenu></LeftMenu></div>
    <!-- <div class="element element-2"><ClusterInfo></ClusterInfo></div> -->
    <div class="element element-2"><RightComponent></RightComponent></div>
  </div>
  <!-- <LeftMenu></LeftMenu>
  <SpaceModule></SpaceModule> -->
  <!-- <ContextMenu></ContextMenu> -->
  <!-- <FileTree></FileTree> -->
</template>

<style scoped lang="scss">
.container {
  display: flex; /* Используем Flexbox */
  width: 100%; /* Ширина контейнера */
  height: 100%;
  border: 1px solid #000;
}

.element {
  flex: 1; /* Элементы растягиваются одинаково */
  border: 1px solid #ccc;
}

.element-1 {
  display: flex;
  flex: 0 0 auto; /* Не растягиваем, а фиксируем ширину */ /* Устанавливаем начальную ширину для первого элемента */
}

.element-2 {
  position: relative;
  display: flex;
  flex: 1; /* Второй элемент будет занимать оставшуюся ширину */
}
</style>
