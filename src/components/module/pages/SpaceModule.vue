<script lang="ts" setup>
import { reactive } from 'vue'
import ButtonsComponent from '@/components/module/ButtonsComponent.vue'
import TableComponent from '@/components/module/TableComponent.vue'
import { useRenderStore } from '@/stores'
import { SpacePage, TypeModule } from '@/types/components'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { Cluster } from '@/types/entities'
import UsersComponents from '../space/UsersComponents.vue'
import ClustersComponent from '../space/ClustersComponent.vue'
import AddUserPage from './AddUserPage.vue'
import SecurityGroupsComponent from '../space/SecurityGroupsComponent.vue'
const store = useRenderStore()
// Линия кнопок
const buttons = reactive([
  {
    label: 'Кластеры',
    action: () => {
      store.SpacePage = SpacePage.Clusters
    },
  },
  {
    label: 'Пользователи',
    action: () => {
      store.SpacePage = SpacePage.Users
    },
  },
  {
    label: 'Security groups',
    action: () => {
      store.SpacePage = SpacePage.Security
    },
  },
])
const closeModal = () => {
  if (store.centerModule) {
    store.centerModule.isActive = false
  }
}
</script>

<template>
  <div class="modal-header">
    <h1>Название</h1>
  </div>
  <ButtonsComponent :buttons="buttons"></ButtonsComponent>
  <div class="main-content">
    <UsersComponents v-if="store.SpacePage === SpacePage.Users" />
    <ClustersComponent v-if="store.SpacePage === SpacePage.Clusters" />
    <SecurityGroupsComponent v-if="store.SpacePage === SpacePage.Security" />
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
