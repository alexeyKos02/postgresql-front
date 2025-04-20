<template>
  <div class="icon" @click="action">
    <FontAwesomeIcon icon="fa-solid fa-plus" />
  </div>

  <ScrollPanel class="clusters-scroll-panel">
    <div v-if="currentClusters.length === 0" class="empty-state">
      <FontAwesomeIcon icon="fa-solid fa-database" class="empty-icon" />
      <p class="empty-title">Нет доступных кластеров</p>
      <p class="empty-subtitle">Создайте первый кластер с помощью кнопки "+" выше</p>
    </div>

    <div v-else class="clusters-grid">
      <div
        v-for="cluster in currentClusters"
        :key="cluster.systemName"
        class="cluster-card"
        :class="{
          updated: cluster.id === updatedClusterId,
          waiting: cluster.status === 1,
        }"
        @click="showClusterInfo(cluster.id)"
      >
        <div class="card-header">
          <div class="name-section">
            <FontAwesomeIcon icon="fa-solid fa-database" class="card-icon" />
            <span class="cluster-name">{{ cluster.systemName }}</span>
          </div>
          <div class="owner-badge">
            <div class="owner-avatar">
              <FontAwesomeIcon icon="fa-solid fa-user" />
            </div>
            <span class="owner-name">{{ cluster.ownerName }}</span>
          </div>
        </div>

        <div class="card-footer">
          <span class="status-badge" :class="getStatusInfo(cluster.status).class">
            {{ getStatusInfo(cluster.status).label }}
          </span>

          <div class="btns-panel">
            <button class="btn-icon green" @click.stop="reload(cluster.systemName)">
              <FontAwesomeIcon icon="fa-solid fa-rotate-right" />
            </button>
            <button class="btn-icon red" @click.stop="remove(cluster.systemName)">
              <FontAwesomeIcon icon="fa-solid fa-trash" />
            </button>
            <button class="btn-icon blue" @click.stop="edit(cluster.id)">
              <FontAwesomeIcon icon="fa-solid fa-pen" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </ScrollPanel>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, watch, ref } from 'vue';
import { TypeModule } from '@/types/components';
import { useRenderStore } from '@/stores';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import ScrollPanel from 'primevue/scrollpanel';
import { restartCluster, deleteCluster } from '@/utils/api';

const props = defineProps<{
  workspaceId: number;
  moduleId: number;
}>();

const toast = useToast();
const store = useRenderStore();
const { clusters } = storeToRefs(store);
const updatedClusterId = ref<number | null>(null);
const intervalId = ref<number | null>(null);

const currentClusters = computed(() => clusters.value[props.moduleId] || []);

async function fetchClusters() {
  try {
    await store.fetchClusters(props.workspaceId, props.moduleId);
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось загрузить кластеры',
      life: 3000,
    });
  }
}

onMounted(() => {
  fetchClusters();
  intervalId.value = window.setInterval(fetchClusters, 1000);
});

onUnmounted(() => {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
});

watch(() => props.workspaceId, fetchClusters);

async function reload(systemName: string) {
  const cluster = currentClusters.value.find((c) => c.systemName === systemName);
  if (!cluster) return;

  try {
    await restartCluster(props.workspaceId, cluster.id);
    toast.add({
      severity: 'success',
      summary: 'Кластер перезапущен',
      detail: systemName,
      life: 3000,
    });

    updatedClusterId.value = cluster.id;
    setTimeout(() => {
      updatedClusterId.value = null;
    }, 1500);
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка перезапуска',
      detail: error.message,
      life: 4000,
    });
  }
}

async function remove(systemName: string) {
  const cluster = currentClusters.value.find((c) => c.systemName === systemName);
  if (!cluster) return;

  try {
    await deleteCluster(props.workspaceId, cluster.id);
    toast.add({ severity: 'success', summary: 'Кластер удалён', detail: systemName, life: 3000 });
    await fetchClusters();
  } catch (error: any) {
    toast.add({ severity: 'error', summary: 'Ошибка удаления', detail: error.message, life: 4000 });
  }
}

function edit(clusterId: number) {
  store.singleClusters[props.moduleId] = clusterId;
  store.modules[props.moduleId].type = TypeModule.ChangeCluster;
}

function showClusterInfo(clusterId: number) {
  store.singleClusters[props.moduleId] = clusterId;
  store.modules[props.moduleId].type = TypeModule.ClusterInfo;
}

function action() {
  if (store.modules[0]) {
    store.modules[0].type = TypeModule.CreateCluster;
  }
}

function getStatusInfo(status: number) {
  switch (status) {
    case 0:
      return { label: 'Запускается', class: 'status-blue' };
    case 1:
      return { label: 'Перезагружается', class: 'status-yellow' };
    case 2:
      return { label: 'Запущен', class: 'status-green' };
    default:
      return { label: 'Удалён', class: 'status-gray' };
  }
}
</script>

<style scoped lang="scss">
.icon {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
  cursor: pointer;
  font-size: 1.6rem;
  color: #3498db;
  transition: color 0.3s ease;
  &:hover {
    color: #2980b9;
  }
}

.clusters-scroll-panel {
  height: 98%;
  padding-right: 4px;
  :deep(.p-scrollpanel-bar) {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
}

.clusters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  padding: 10px;
}

.cluster-card {
  position: relative;
  background-color: #fff;
  border: 1px solid #e0e6ed;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.3s ease;
  cursor: pointer;

  &.updated {
    animation: pulse-fade 1.2s ease-in-out;
    border-color: #3498db;
    box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.15);
  }

  &.waiting {
    animation: smooth-pulse 2.5s ease-in-out infinite;
    border-color: #f0ad4e;
  }
}

@keyframes pulse-fade {
  0% {
    background-color: #eaf6ff;
  }
  50% {
    background-color: #d6ecfb;
  }
  100% {
    background-color: #fff;
  }
}

@keyframes smooth-pulse {
  0% {
    transform: scale(1);
    background-color: #fffbe6;
  }
  50% {
    transform: scale(1.015);
    background-color: #fff3c4;
  }
  100% {
    transform: scale(1);
    background-color: #fffbe6;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .name-section {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .card-icon {
    font-size: 20px;
    color: #3498db;
  }

  .cluster-name {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
  }
}

.owner-badge {
  display: flex;
  align-items: center;
  background-color: #f3f4f6;
  border-radius: 20px;
  padding: 4px 10px;
  gap: 6px;
  font-size: 13px;
  color: #374151;
  font-weight: 500;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.owner-avatar {
  background-color: #dbeafe;
  color: #2563eb;
  border-radius: 50%;
  padding: 4px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  font-size: 13px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 14px;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-green {
  background-color: #28a745;
}
.status-yellow {
  background-color: #f0ad4e;
}
.status-blue {
  background-color: #3498db;
}
.status-gray {
  background-color: #6c757d;
}

.btns-panel {
  display: flex;
  gap: 10px;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 8px;
  border-radius: 50%;
  font-size: 14px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  &.green {
    color: #4caf50;
    &:hover {
      background-color: rgba(76, 175, 80, 0.12);
    }
  }
  &.red {
    color: #e74c3c;
    &:hover {
      background-color: rgba(231, 76, 60, 0.12);
    }
  }
  &.blue {
    color: #3498db;
    &:hover {
      background-color: rgba(52, 152, 219, 0.12);
    }
  }

  &:focus {
    outline: none;
  }
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #777;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.empty-icon {
  font-size: 30px;
  color: #ccc;
}

.empty-title {
  font-size: 16px;
  font-weight: bold;
}

.empty-subtitle {
  font-size: 14px;
  color: #999;
}
</style>
