<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { TypeModule } from '@/types/components';
import { useRenderStore } from '@/stores';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import ScrollPanel from 'primevue/scrollpanel';

// Props
const props = defineProps<{
  workspaceId: number;
  moduleId: number;
}>();

const toast = useToast();
const store = useRenderStore();
const { clusters } = storeToRefs(store);

// Заглушка для отображения
const mockClusters = [
  { name: 'Заглушка кластер 1' },
  { name: 'Заглушка кластер 2' },
  { name: 'Заглушка кластер 3' },
  { name: 'Заглушка кластер 4' },
  { name: 'Заглушка кластер 5' },
  { name: 'Заглушка кластер 6' },
  { name: 'Заглушка кластер 7' },
];

// Получаем список кластеров для текущего workspace
const currentClusters = computed(() => {
  const realClusters = clusters.value[props.moduleId];
  return realClusters && realClusters.length > 0 ? realClusters : mockClusters;
});

// При рендере компонента сразу грузим кластеры
// onMounted(async () => {
//   try {
//     await store.fetchClusters(props.workspaceId, props.moduleId);
//   } catch (error) {
//     toast.add({
//       severity: 'error',
//       summary: 'Ошибка',
//       detail: 'Не удалось загрузить кластеры',
//       life: 3000,
//     });
//   }
// });

// Функции для кнопок
function reload(id: string) {
  toast.add({ severity: 'success', summary: `Перезагружен`, detail: id, life: 3000 });
}
function stop(id: string) {
  toast.add({ severity: 'warn', summary: `Остановлен`, detail: id, life: 3000 });
}
function remove(id: string) {
  toast.add({ severity: 'error', summary: `Удален`, detail: id, life: 3000 });
}

async function action() {
  if (store.modules[0]) {
    store.modules[0].type = TypeModule.CreateCluster;
    store.centerModuleHistory = [...store.centerModuleHistory, TypeModule.CreateCluster];
  }
}
</script>

<template>
  <div class="icon" @click="action">
    <FontAwesomeIcon icon="fa-solid fa-plus" />
  </div>

  <!-- ScrollPanel от PrimeVue -->
  <ScrollPanel class="clusters-scroll-panel">
    <div class="clusters-grid">
      <div
        v-for="cluster in currentClusters"
        :key="cluster.name"
        class="cluster-card"
        @click="action"
      >
        <div class="card-header">
          <FontAwesomeIcon icon="fa-solid fa-database" class="card-icon" />
          <span class="cluster-name">{{ cluster.name }}</span>
        </div>

        <div class="btns-panel">
          <button class="btn-restart" @click.stop="reload(cluster.name)">
            <FontAwesomeIcon icon="fa-solid fa-rotate-right" />
          </button>
          <button class="btn-stop" @click.stop="stop(cluster.name)">
            <FontAwesomeIcon icon="fa-solid fa-pause" />
          </button>
          <button class="btn-delete" @click.stop="remove(cluster.name)">
            <FontAwesomeIcon icon="fa-solid fa-trash" />
          </button>
          <button class="btn-edit" @click.stop="action">
            <FontAwesomeIcon icon="fa-solid fa-pen" />
          </button>
        </div>
      </div>
    </div>
  </ScrollPanel>
</template>

<style scoped lang="scss">
.icon {
  display: flex;
  justify-content: end;
  margin-bottom: 1.5rem;
  cursor: pointer;
  font-size: 1.6rem;
  color: #3498db;
  transition: color 0.3s ease;

  &:hover {
    color: #2980b9;
  }
}

// ✅ Прокрутка через PrimeVue ScrollPanel
.clusters-scroll-panel {
  height: 98%;
  padding-right: 4px;

  :deep(.p-scrollpanel-bar) {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  :deep(.p-scrollpanel-wrapper) {
    overflow: hidden; // обрезаем scroll-panel внутренне, не контейнер
  }
}

.clusters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); // чуть больше
  gap: 32px;
  padding: 10px;
}

.cluster-card {
  background: linear-gradient(145deg, #ffffff, #f3f3f4);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #e0e0e0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
    background: linear-gradient(145deg, #f9f9f9, #eaeaec);
  }
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .card-icon {
    font-size: 24px;
    margin-right: 12px;
    color: #3498db;
  }

  .cluster-name {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
}

.btns-panel {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

button {
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  background-color: #fff;
  transition: all 0.2s linear;
  flex: 1;
  text-align: center;
  font-size: 14px;

  &:hover {
    opacity: 0.9;
  }
}

// Цветовые стили кнопок
.btn-restart {
  border-color: #4caf50;
  color: #4caf50;
}
.btn-restart:hover {
  background-color: #4caf50;
  color: white;
}

.btn-stop {
  border-color: #f39c12;
  color: #f39c12;
}
.btn-stop:hover {
  background-color: #f39c12;
  color: white;
}

.btn-delete {
  border-color: #e74c3c;
  color: #e74c3c;
}
.btn-delete:hover {
  background-color: #e74c3c;
  color: white;
}

.btn-edit {
  border-color: #3498db;
  color: #3498db;
}
.btn-edit:hover {
  background-color: #3498db;
  color: white;
}
</style>
