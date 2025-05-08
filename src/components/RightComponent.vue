<script lang="ts" setup>
import ModuleComponent from '@/components/module/ModuleComponent.vue';
import ClusterComponent from '@/components/module/pages/ClusterComponent.vue';
import SpaceModule from '@/components/module/pages/SpaceModule.vue';
import ClusterInfo from './module/pages/ClusterInfo.vue';
import AddUserPage from './module/pages/AddUserPage.vue';
import AddSecurityGroup from './module/pages/AddSecurityGroup.vue';
import ChangeCluster from './module/pages/ChangeCluster.vue';

import { useRenderStore } from '@/stores';
import { TypeModule, type Module } from '@/types/components';
import { computed, ref, watch } from 'vue';
import type { Component } from 'vue';

const store = useRenderStore();
const module = ref<Module | null>(store.modules[0]);
const workSpace = computed(() => store.currentWorkspaces[0]);

// Автообновление
watch(
  () => workSpace.value?.id,
  async (newId) => {
    if (newId) {
      await store.fetchCurrentUserInfo(newId, workSpace.value.name, 0);
    }
  },
  { immediate: true },
);

// История типов
watch(
  () => module.value?.type,
  (newType, oldType) => {
    if (newType && newType !== oldType) {
      store.pushModuleTypeToHistory(newType, 0);
    }
  },
  { immediate: true },
);

// --- Сопоставление типов и компонентов
const componentMap: Partial<Record<TypeModule, Component>> = {
  [TypeModule.CreateCluster]: ClusterComponent,
  [TypeModule.Space]: SpaceModule,
  [TypeModule.ClusterInfo]: ClusterInfo,
  [TypeModule.AddUser]: AddUserPage,
  [TypeModule.AddSecurityGroup]: AddSecurityGroup,
  [TypeModule.ChangeCluster]: ChangeCluster,
};

const activeComponent = computed(() => {
  const type = module.value?.type;
  return type && componentMap[type] ? componentMap[type] : null;
});

// --- Пропсы для динамического компонента
const componentProps = computed(() => {
  if (!module.value) return {};

  switch (module.value.type) {
    case TypeModule.CreateCluster:
    case TypeModule.AddUser:
    case TypeModule.AddSecurityGroup:
      return {
        workspaceId: workSpace.value?.id,
        class: 'add-user',
      };
    case TypeModule.Space:
      return { module: module.value };
    case TypeModule.ClusterInfo:
    case TypeModule.ChangeCluster:
      return {
        workspaceId: workSpace.value?.id,
        moduleId: module.value.location,
        class: 'add-user',
      };
    default:
      return {};
  }
});
</script>

<template>
  <transition name="fade" mode="out-in">
    <ModuleComponent v-if="activeComponent" :key="module?.type">
      <component :is="activeComponent" v-bind="componentProps" />
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
