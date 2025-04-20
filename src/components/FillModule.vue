<script lang="ts" setup>
import ModuleComponent from '@/components/module/ModuleComponent.vue';
import ClusterComponent from '@/components/module/pages/ClusterComponent.vue';
import { useRenderStore } from '@/stores';
import { TypeModule, type Module } from '@/types/components';
import SpaceModule from '@/components/module/pages/SpaceModule.vue';
import ClusterInfo from './module/pages/ClusterInfo.vue';
import AddUserPage from './module/pages/AddUserPage.vue';
import AddSecurityGroup from './module/pages/AddSecurityGroup.vue';
import { computed } from 'vue';
const store = useRenderStore();

const props = defineProps<{
  module: Module;
}>();
const workSpace = computed(() => store.workspaces[0]);
</script>

<template>
  <transition name="fade">
    <ModuleComponent v-if="module.type === TypeModule.CreateCluster">
      <ClusterComponent :workspace-id="workSpace.id" />
    </ModuleComponent>
  </transition>
  <transition name="fade">
    <ModuleComponent v-if="module.type === TypeModule.Space">
      <SpaceModule :module="module" />
    </ModuleComponent>
  </transition>
  <transition name="fade">
    <ModuleComponent v-if="module.type === TypeModule.ClusterInfo">
      <ClusterInfo />
    </ModuleComponent>
  </transition>
  <transition name="fade">
    <ModuleComponent v-if="module.type === TypeModule.AddUser" class="add-user-module">
      <AddUserPage :workspace-id="workSpace.id" class="add-user" />
    </ModuleComponent>
  </transition>
  <transition name="fade">
    <ModuleComponent v-if="module.type === TypeModule.AddSecurityGroup" class="add-user-module">
      <AddSecurityGroup class="add-user" :workspace-id="workSpace.id" />
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
.main-content {
  margin-top: 5%;
}
h1 {
  margin-top: 0;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}
.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #888;
  cursor: pointer;
}
.add-user-module {
  width: auto;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.add-user {
}
</style>
