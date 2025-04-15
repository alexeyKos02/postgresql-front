<script lang="ts" setup>
import { reactive, computed } from 'vue';
import ButtonsComponent from '@/components/module/ButtonsComponent.vue';
import { useRenderStore } from '@/stores';
import { SpacePage, type Module } from '@/types/components';
import UsersComponents from '../space/UsersComponents.vue';
import ClustersComponent from '../space/ClustersComponent.vue';
import SecurityGroupsComponent from '../space/SecurityGroupsComponent.vue';

const store = useRenderStore();

const props = defineProps<{
  module: Module;
}>();

// ✅ Добавляем вычисляемое свойство для workspace
const workspace = computed(() => store.currentWorkspaces[props.module.location]);

function changeType(type: SpacePage) {
  const localModule = store.modules[props.module?.location];
  localModule.spacePage = type;
}

// Линия кнопок
const buttons = reactive([
  {
    label: 'Кластеры',
    action: () => {
      changeType(SpacePage.Clusters);
    },
  },
  {
    label: 'Пользователи',
    action: () => {
      changeType(SpacePage.Users);
    },
  },
  {
    label: 'Security groups',
    action: () => {
      changeType(SpacePage.Security);
    },
  },
]);
</script>

<template>
  <div class="modal-header">
    <h1>{{ workspace?.name || 'Без имени' }}</h1>
  </div>
  <ButtonsComponent :buttons="buttons"></ButtonsComponent>
  <div class="main-content">
    <UsersComponents v-if="module.spacePage === SpacePage.Users" />
    <ClustersComponent
      :workspace-id="workspace?.id"
      :module-id="module.location"
      v-if="module.spacePage === SpacePage.Clusters"
    />
    <SecurityGroupsComponent
      :workspace-id="workspace?.id"
      :module-id="module.location"
      v-if="module.spacePage === SpacePage.Security"
    />
  </div>
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
.icon {
  display: flex;
  justify-content: end;
}
.main-content {
  display: flex;
  flex-direction: column;
  height: 62%;
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
.table {
  flex: 1;
  overflow: scroll;
}
</style>
