<script lang="ts" setup>
import { useRenderStore } from '@/stores';
import { TypeModule } from '@/types/components';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { defineProps } from 'vue';
import { UserRole, type Cluster, type SecurityGroup, type User } from '@/types/entities';
import Tag from 'primevue/tag';
const props = defineProps<{
  users?: User[];
  clusters?: Cluster[];
  securityGoups?: SecurityGroup[];
}>();
const store = useRenderStore();
function openInfo() {
  if (store.centerModule) {
    store.centerModule.type = TypeModule.ClusterInfo;
  }
}
</script>
<template>
  <div class="container">
    <div v-for="cluster in props.clusters" :key="cluster.name" class="item" @click="openInfo">
      <span>{{ cluster.name }}</span>
      <div class="btns-pannel">
        <button class="btn-restart"><FontAwesomeIcon icon="fa-solid fa-rotate-right" /></button>
        <button class="btn-stop"><FontAwesomeIcon icon="fa-solid fa-pause" /></button>
        <button class="btn-delete"><FontAwesomeIcon icon="fa-solid fa-trash" /></button>
        <button class="btn-edit"><FontAwesomeIcon icon="fa-solid fa-pen" /></button>
      </div>
    </div>
    <div v-for="user in props.users" :key="user.email" class="item" @click="openInfo">
      <span>{{ user.email }}</span>
      <Tag severity="info" value="ADMIN" rounded v-if="user.role === UserRole.ADMIN"></Tag>
      <Tag severity="info" value="EDITOR" rounded v-if="user.role === UserRole.EDITOR"></Tag>
      <Tag severity="info" value="VIEWER" rounded v-if="user.role === UserRole.VIEWER"></Tag>
    </div>
    <div v-for="group in props.securityGoups" :key="group.id" class="item" @click="openInfo">
      <span>{{ group.name }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btns-pannel {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.container {
  display: flex;
  flex-direction: column; /* Вертикальное расположение */
  width: 100%; /* Ширина контейнера */
}
.item {
  display: flex;
  justify-content: space-between; /* Распределение по ширине */
  align-items: center; /* Центрирование по вертикали */
  padding: 10px;
  background-color: white;
  margin-bottom: 10px; /* Отступ между элементами */
  border-radius: 5px; /* Закругление углов */
  background-color: #f4f4f5;
}
button {
  padding: 10px 15px;
  margin-right: 5px;
  flex: 1;
  border: 1px solid transparent;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  background-color: #fff;
  transition: all 0.2s linear;
}
.btn-restart {
  border-color: #4caf50;
  // background-color: #4caf50;
  color: #4caf50;
}
.btn-restart:hover {
  // border-color: #4caf50;
  background-color: #4caf50;
  color: white;
}
.btn-stop {
  border-color: #f39c12;
  color: #f39c12;
  // background-color: #f39c12;
  // color: #fff;
}
.btn-stop:hover {
  // border-color: #4caf50;
  background-color: #f39c12;
  color: white;
}
.btn-delete {
  border-color: #e74c3c;
  color: #e74c3c;
  // background-color: #e74c3c;
  // color: #fff;
}
.btn-delete:hover {
  // border-color: #4caf50;
  background-color: #e74c3c;
  color: white;
}
.btn-edit {
  border-color: #3498db;
  color: #3498db;
  // background-color: #3498db;
  // color: #fff;
}
.btn-edit:hover {
  // border-color: #4caf50;
  background-color: #3498db;
  color: white;
}
td button:hover {
  opacity: 0.9;
}
td button:focus {
  outline: none;
}
</style>
