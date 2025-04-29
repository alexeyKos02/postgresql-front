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
const props = defineProps<{
  module: Module;
}>();

const store = useRenderStore();
const module = ref<Module | null>(store.modules[props.module.location]);
const workSpace = computed(() => store.currentWorkspaces[props.module.location]);

// 👉 Автообновление currentUserInfo при смене workspace
watch(
  () => workSpace.value?.id,
  async (newId) => {
    if (newId) {
      await store.fetchCurrentUserInfo(newId, workSpace.value.name, props.module.location);
    }
  },
  { immediate: true },
);

// Слежение за изменением module?.type и добавление в историю
watch(
  () => module.value?.type,
  (newType, oldType) => {
    if (newType && newType !== oldType) {
      if (module.value && !module.value.isActive && module.value.type !== TypeModule.Default) {
        module.value.isActive = true;
      }
      store.pushModuleTypeToHistory(newType, props.module.location); // 0 — индекс центра
    }
  },
  { immediate: true },
);
</script>

<template>
  <transition name="fade">
    <ModuleComponent v-if="module?.type === TypeModule.CreateCluster" :module="module">
      <ClusterComponent :workspace-id="workSpace.id" />
    </ModuleComponent>
  </transition>
  <transition name="fade">
    <ModuleComponent v-if="module?.type === TypeModule.Space" :module="module">
      <SpaceModule :module="module" />
    </ModuleComponent>
  </transition>
  <transition name="fade">
    <ModuleComponent v-if="module?.type === TypeModule.ClusterInfo" :module="module">
      <ClusterInfo :workspace-id="workSpace.id" :module-id="module.location" />
    </ModuleComponent>
  </transition>
  <transition name="fade">
    <ModuleComponent
      v-if="module?.type === TypeModule.AddUser"
      class="add-user-module"
      :module="module"
    >
      <AddUserPage class="add-user" :workspace-id="workSpace.id" />
    </ModuleComponent>
  </transition>
  <transition name="fade">
    <ModuleComponent
      v-if="module?.type === TypeModule.AddSecurityGroup"
      class="add-user-module"
      :module="module"
    >
      <AddSecurityGroup :workspace-id="workSpace.id" class="add-user" />
    </ModuleComponent>
  </transition>
  <transition name="fade">
    <ModuleComponent
      v-if="module?.type === TypeModule.ChangeCluster"
      class="add-user-module"
      :module="module"
    >
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
  /* height: auto; */
  display: flex;
  justify-content: center;
  align-items: center;
}
.add-user {
}
</style>
