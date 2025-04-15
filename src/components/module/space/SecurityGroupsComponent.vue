<script setup lang="ts">
import type { SecurityGroup } from '@/types/entities';
import TableComponent from '../TableComponent.vue';
import ScrollPanel from 'primevue/scrollpanel';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRenderStore } from '@/stores';
import { TypeModule } from '@/types/components';
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { getSecurityGroups } from '@/utils/api'; // ✅ Используем готовую функцию

const props = defineProps<{
  workspaceId: number;
  moduleId: number;
}>();

const store = useRenderStore();
const toast = useToast();

const securityGroups = ref<SecurityGroup[]>([]);
const loading = ref(true);

// 🧩 Моковые данные для разработки
const mockSecurityGroups: SecurityGroup[] = [
  { name: 'Mock Group 1', id: 101 },
  { name: 'Mock Group 2', id: 102 },
  { name: 'Mock Group 3', id: 103 },
  { name: 'Mock Group 4', id: 104 },
  { name: 'Mock Group 5', id: 105 },
];

// ✅ Просто вызываем готовую функцию
async function fetchSecurityGroups() {
  try {
    loading.value = true;
    const response = await getSecurityGroups(props.workspaceId);
    securityGroups.value = mockSecurityGroups;
    // if (response.length === 0) {
    //   // Если с бэка пусто — используем моковые данные
    //   securityGroups.value = mockSecurityGroups;
    // } else {
    //   securityGroups.value = response.map((item) => ({
    //     name: item.name,
    //     id: item.id,
    //   }));
    // }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка загрузки Security Groups',
      detail: error.message || 'Не удалось загрузить список',
      life: 4000,
    });

    // Если ошибка, тоже подставим моковые данные для разработки
    securityGroups.value = mockSecurityGroups;
  } finally {
    loading.value = false;
  }
}

function remove(id: string) {
  const numericId = Number(id);
  securityGroups.value = securityGroups.value.filter(
    (securityGroup) => securityGroup.id !== numericId
  );

  toast.add({
    severity: 'info',
    summary: 'Удален',
    detail: `Security Group: ${id}`,
    life: 3000,
  });
}

function action() {
  if (store.modules[0]) {
    store.modules[0].type = TypeModule.AddSecurityGroup;
    store.centerModuleHistory = [...store.centerModuleHistory, TypeModule.AddSecurityGroup];
  }
}

// ✅ Запрос данных при монтировании компонента
onMounted(() => {
  fetchSecurityGroups();
});
</script>

<template>
  <div>
    <div class="icon" @click="action">
      <FontAwesomeIcon icon="fa-solid fa-plus" />
    </div>
    <ScrollPanel style="width: 100%; height: 200px" class="table">
      <div v-if="loading" class="loading-text">Загрузка...</div>
      <TableComponent v-else :security-goups="securityGroups" :functions="[remove]" />
    </ScrollPanel>
  </div>
</template>

<style scoped>
.icon {
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
  margin-bottom: 10px;
}

.table {
  flex: 1;
  margin: 20px auto;
}

.loading-text {
  text-align: center;
  padding: 20px;
  color: #888;
}
</style>
