<script lang="ts" setup>
import ModuleComponent from '@/components/module/ModuleComponent.vue';
import ClusterComponent from '@/components/module/pages/ClusterComponent.vue';
import { useRenderStore } from '@/stores';
import { TypeModule, type Module } from '@/types/components';
import SpaceModule from '@/components/module/pages/SpaceModule.vue';
import ClusterInfo from './module/pages/ClusterInfo.vue';
import AddUserPage from './module/pages/AddUserPage.vue';
import AddSecurityGroup from './module/pages/AddSecurityGroup.vue';
import { computed, ref, watch } from 'vue';
import ChangeCluster from './module/pages/ChangeCluster.vue';

const store = useRenderStore();
const module = ref<Module | null>(store.modules[0]);
const workSpace = computed(() => store.workspaces[0]);

// Слежение за изменением module?.type и добавление в историю
watch(
  () => module.value?.type,
  (newType, oldType) => {
    if (newType && newType !== oldType) {
      store.pushModuleTypeToHistory(newType, 0); // 0 — индекс центра
    }
  },
  { immediate: true },
);
</script>

<template>
  <transition name="fade">
    <ModuleComponent v-if="module?.type === TypeModule.CreateCluster">
      <ClusterComponent :workspace-id="workSpace.id" />
    </ModuleComponent>
  </transition>
  <transition name="fade">
    <ModuleComponent v-if="module?.type === TypeModule.Space">
      <SpaceModule :module="module" />
    </ModuleComponent>
  </transition>
  <transition name="fade">
    <ModuleComponent v-if="module?.type === TypeModule.ClusterInfo">
      <ClusterInfo :workspace-id="workSpace.id" :module-id="module.location" />
    </ModuleComponent>
  </transition>
  <transition name="fade">
    <ModuleComponent v-if="module?.type === TypeModule.AddUser" class="add-user-module">
      <AddUserPage class="add-user" :workspace-id="workSpace.id" />
    </ModuleComponent>
  </transition>
  <transition name="fade">
    <ModuleComponent v-if="module?.type === TypeModule.AddSecurityGroup" class="add-user-module">
      <AddSecurityGroup :workspace-id="workSpace.id" class="add-user" />
    </ModuleComponent>
  </transition>
  <transition name="fade">
    <ModuleComponent v-if="module?.type === TypeModule.ChangeCluster" class="add-user-module">
      <ChangeCluster :workspace-id="workSpace.id" :module-id="module.location" class="add-user" />
    </ModuleComponent>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}
.add-user-module {
  /* width: auto;
  height: auto; */
  display: flex;
  justify-content: center;
}
</style>
