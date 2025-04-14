<script lang="ts" setup>
import FileTree from '@/components/FileTree.vue';
import { computed, ref } from 'vue';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import { useRenderStore } from '@/stores';
import RightComponent from '@/components/RightComponent.vue';
import type { Module } from '@/types/components';
import ModuleComponent from '@/components/module/ModuleComponent.vue';
import FillModule from '@/components/FillModule.vue';

const store = useRenderStore();

// const fullView = ref<boolean>(false);

const fullView = computed(() => store.modules[0]?.isActive ?? false);

const dividedModules = ref<Module[]>(store.modules);
const close = ref<boolean>(true);

function chahgeView() {
  close.value = !close.value;
}
</script>

<template>
  <div class="container" :class="{ 'container--divided': !fullView }">
    <div
      class="tree-container"
      :class="{
        'tree-container--open': !close && !fullView,
        'tree-container--full': fullView,
      }"
    >
      <i v-show="close && !fullView" class="pi pi-bars icon" @click="chahgeView"></i>
      <i v-if="!close && !fullView" class="pi pi-times icon" @click="chahgeView"></i>
      <!-- <FileTree v-if="(!close && !fullView) || true" /> -->
      <FileTree v-if="!close || fullView" />
    </div>
    <div class="main-component" :class="{ 'main-component--full': fullView }">
      <div v-if="!fullView" class="divide">
        <Splitter style="height: 90vh">
          <SplitterPanel class="flex items-center justify-center" :size="50" :minSize="10">
            <Splitter layout="vertical">
              <SplitterPanel class="flex items-center justify-center" :size="50">
                <FillModule :module="dividedModules[1]" />
              </SplitterPanel>
              <SplitterPanel :size="50">
                <!-- <FillModule :module="dividedModules[4]" />  -->
              </SplitterPanel>
            </Splitter>
          </SplitterPanel>
          <SplitterPanel class="flex items-center justify-center" :size="50" :minSize="10">
            <Splitter layout="vertical">
              <SplitterPanel class="flex items-center justify-center" :size="50">
                <FillModule :module="dividedModules[2]" />
              </SplitterPanel>
              <SplitterPanel :size="50">
                <!-- <FillModule :module="dividedModules[3]" /> -->
              </SplitterPanel>
            </Splitter>
          </SplitterPanel>
        </Splitter>
      </div>
      <RightComponent v-if="fullView" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  margin-left: 2vw;
  margin-right: 2vw;
  padding-top: 10vh;
  flex: 1;
  display: flex;
  // width: 100%; /* Ширина контейнера */
  // height: 100%;
  &--divided {
    gap: 1rem;
  }
}
.tree-container {
  // position: absolute;
  background: white;
  // margin-left: 1vw;
  // width: calc(2rem + 2px);
  // height: calc(2rem + 2px);
  border: 1px solid var(--p-toolbar-border-color);
  border-radius: 10px;
  transition: all 0.5s;
  z-index: 999;
  height: calc(2rem + 2px);
  width: calc(2rem + 2px);
  &--open {
    width: 15%;
    height: 95%;
  }
  &--full {
    width: 20%;
    height: 95%;
    margin-left: 0;
    z-index: 0;
  }
}
.main-component {
  float: right;
  width: 97%;
  // margin-top: calc(2rem + 2px);
  &--full {
    position: relative;
    right: 0;
    width: 80%;
    height: 100%;
  }
}
.icon {
  padding: 0.5rem;
  font-size: 1rem;
}
.icon:hover {
  cursor: pointer;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.divide {
  display: flex;
  flex-direction: column;
  overflow: scroll;
  width: 100%;
  height: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Добавляет тень */
  height: 95%;
  width: 100%;
  margin-left: 1vw;
  border-radius: 10px;
}
// .element {
//   flex: 1; /* Элементы растягиваются одинаково */
// }

// .element-1 {
//   display: flex;
//   flex: 0 0 auto; /* Не растягиваем, а фиксируем ширину */ /* Устанавливаем начальную ширину для первого элемента */
// }

// .element-2 {
//   position: relative;
//   display: flex;
//   flex: 1; /* Второй элемент будет занимать оставшуюся ширину */
// }
</style>
