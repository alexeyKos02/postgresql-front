<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { type User } from '@/types/entities';
import TableComponent from '../TableComponent.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ScrollPanel from 'primevue/scrollpanel';
import { useRenderStore } from '@/stores';
import { useToast } from 'primevue/usetoast';
import { TypeModule } from '@/types/components';
import { getWorkspaceUsers } from '@/utils/api';

const props = defineProps<{ workspaceId: number; moduleId: number }>();

const toast = useToast();
const store = useRenderStore();

const users = ref<User[]>([]);
const loading = ref(true);

const user = computed(() => store.currentUserInfo[store.currentUserInfoId]);

async function fetchUsers(workspaceId: number) {
  if (props.workspaceId) {
    try {
      loading.value = true;
      const response = await getWorkspaceUsers(workspaceId);
      users.value = response;
    } catch (error: any) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка загрузки',
        detail: error?.message || 'Не удалось загрузить пользователей',
        life: 4000,
      });
      users.value = [];
    } finally {
      loading.value = false;
    }
  } else {
    loading.value = false;
  }
}

function remove(id: string) {
  users.value = users.value.filter((user) => user.email !== id);
  toast.add({ severity: 'info', summary: `Пользователь удален`, detail: id, life: 3000 });
}

function action() {
  if (store.modules[props.moduleId]) {
    store.modules[props.moduleId].type = TypeModule.AddUser;
  }
}

onMounted(() => {
  fetchUsers(props.workspaceId);
});

watch(
  () => props.workspaceId,
  (newId, oldId) => {
    if (newId !== oldId) {
      fetchUsers(newId);
    }
  },
);
</script>

<template>
  <div>
    <div class="icon" @click="action" v-if="user.role !== 'Viewer'">
      <FontAwesomeIcon icon="fa-solid fa-plus" />
    </div>

    <ScrollPanel class="table">
      <div v-if="loading" class="loading-text">Загрузка...</div>

      <div v-else-if="users.length === 0" class="empty">
        <FontAwesomeIcon icon="fa-solid fa-users" class="empty-icon" />
        <div class="empty-message">
          <p>Нет пользователей</p>
          <small>Нажмите <strong>+</strong>, чтобы добавить</small>
        </div>
      </div>

      <TableComponent v-else :users="users" :functions="[remove]" />
    </ScrollPanel>
  </div>
</template>

<style scoped>
.icon {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  cursor: pointer;
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
