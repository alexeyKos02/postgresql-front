<script setup lang="ts">
import type { SecurityGroup } from '@/types/entities';
import TableComponent from '../TableComponent.vue';
import ScrollPanel from 'primevue/scrollpanel';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRenderStore } from '@/stores';
import { TypeModule } from '@/types/components';
import { ref, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { getSecurityGroups, deleteSecurityGroup } from '@/utils/api';

const props = defineProps<{
  workspaceId: number;
  moduleId: number;
}>();

const store = useRenderStore();
const toast = useToast();

const securityGroups = ref<SecurityGroup[]>([]);
const loading = ref(true);

async function fetchSecurityGroups(workspaceId: number) {
  if (props.workspaceId) {
    try {
      loading.value = true;
      const response = await getSecurityGroups(workspaceId);
      securityGroups.value = response.map((item) => ({
        name: item.name,
        id: item.id,
      }));
    } catch (error: any) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка загрузки Security Groups',
        detail: error.message || 'Не удалось загрузить список',
        life: 4000,
      });
      securityGroups.value = [];
    } finally {
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
}

async function remove(id: string) {
  const numericId = Number(id);

  try {
    await deleteSecurityGroup(props.workspaceId, numericId);
    securityGroups.value = securityGroups.value.filter((group) => group.id !== numericId);
    toast.add({
      severity: 'success',
      summary: 'Security Group удалена',
      detail: `ID: ${id}`,
      life: 3000,
    });
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка удаления',
      detail: error.message || 'Не удалось удалить Security Group',
      life: 4000,
    });
  }
}

function action() {
  if (store.modules[0]) {
    store.modules[0].type = TypeModule.AddSecurityGroup;
  }
}

onMounted(() => {
  fetchSecurityGroups(props.workspaceId);
});

watch(
  () => props.workspaceId,
  (newId, oldId) => {
    if (newId !== oldId) {
      fetchSecurityGroups(newId);
    }
  },
);
</script>

<template>
  <div>
    <div class="icon" @click="action">
      <FontAwesomeIcon icon="fa-solid fa-plus" />
    </div>

    <ScrollPanel class="table">
      <div v-if="loading" class="loading-text">Загрузка...</div>

      <div v-else-if="securityGroups.length === 0" class="empty">
        <FontAwesomeIcon icon="fa-solid fa-shield-halved" class="empty-icon" />
        <div class="empty-message">
          <p>Нет Security Groups</p>
          <small>Нажмите <strong>+</strong>, чтобы создать</small>
        </div>
      </div>

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
  max-height: 220px;
  border-radius: 6px;
  overflow-y: auto;
  background-color: #fafafa;
  padding: 0 8px;
}

.loading-text {
  text-align: center;
  padding: 16px;
  font-size: 14px;
  color: #999;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 16px;
  color: #777;
}

.empty-icon {
  font-size: 28px;
  margin-bottom: 8px;
  color: #ccc;
}

.empty-message {
  text-align: center;
  font-size: 14px;
}
</style>
