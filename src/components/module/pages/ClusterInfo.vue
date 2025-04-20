<template>
  <div class="cluster-details">
    <!-- Информация о кластере -->
    <div class="header-toggle">
      <h1 class="page-title">Информация о кластере</h1>
      <button class="toggle-btn" @click="expandedInfo = !expandedInfo">
        {{ expandedInfo ? 'Скрыть' : 'Показать' }}
      </button>
    </div>

    <div v-if="loading" class="loading-text">Загрузка данных...</div>

    <transition name="fade">
      <div v-if="expandedInfo && cluster" class="details-card">
        <div class="detail-row" v-for="(value, key) in displayData" :key="key">
          <span class="label">{{ key }}:</span>
          <span class="value">{{ value }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Статус:</span>
          <span class="value">
            <span :class="getStatusInfo(cluster.status).class">
              {{ getStatusInfo(cluster.status).label }}
            </span>
          </span>
        </div>
      </div>
    </transition>

    <!-- Базы данных -->
    <div class="header-toggle" style="margin-top: 32px">
      <h1 class="page-title">Базы данных</h1>
      <div class="right-controls">
        <button class="toggle-btn" @click="expandedDatabases = !expandedDatabases">
          {{ expandedDatabases ? 'Скрыть' : 'Показать' }}
        </button>
        <div class="icon" @click="showAddForm = !showAddForm">
          <FontAwesomeIcon icon="fa-solid fa-plus" />
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="expandedDatabases">
        <TableComponent :databases="databases" :functions="[deleteDb]" />

        <transition name="fade">
          <div v-if="showAddForm" class="db-card-form">
            <div class="db-card-title">Новая база данных</div>

            <div class="db-form-grid">
              <div class="db-field" v-for="(label, key) in newDbLabels" :key="key">
                <label>{{ label }}</label>
                <input v-model="newDatabase[key]" type="text" />
              </div>
            </div>

            <div class="form-footer">
              <button class="cancel-btn" @click="showAddForm = false">Отмена</button>
              <button class="submit-db-btn" @click="submitNewDatabase">Создать</button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <!-- Пользователи -->
    <div class="header-toggle" style="margin-top: 32px">
      <h1 class="page-title">Пользователи</h1>
      <div class="right-controls">
        <button class="toggle-btn" @click="expandedUsers = !expandedUsers">
          {{ expandedUsers ? 'Скрыть' : 'Показать' }}
        </button>
        <div class="icon" @click="showUserForm = !showUserForm">
          <FontAwesomeIcon icon="fa-solid fa-plus" />
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="expandedUsers">
        <TableComponent :clusterUsers="users" />

        <transition name="fade">
          <div v-if="showUserForm" class="db-card-form">
            <div class="db-card-title">Новый пользователь</div>

            <div class="db-form-grid">
              <div class="db-field">
                <label>Имя пользователя</label>
                <InputText v-model="newUser.username" style="width: 100%" />
              </div>
              <div class="db-field">
                <label>Пароль</label>
                <div class="password-with-button">
                  <Password v-model="newUser.password" toggleMask style="width: 100%" />
                  <Button label="Сгенерировать" @click="generatePassword" size="small" />
                </div>
              </div>

              <div class="db-field">
                <label>База данных</label>
                <Dropdown
                  v-model="newUser.database"
                  :options="databases"
                  placeholder="Выберите базу данных"
                  :filter="true"
                  :showClear="true"
                  style="width: 100%"
                />
              </div>
              <div class="db-field">
                <label>Роли</label>
                <MultiSelect
                  v-model="newUser.roles"
                  :options="availableRoles"
                  placeholder="Выберите роли"
                  display="chip"
                  :filter="true"
                  style="width: 100%"
                />
              </div>
              <div class="db-field">
                <label>Дата истечения</label>
                <Calendar
                  v-model="newUser.expiryDate"
                  showIcon
                  showTime
                  hourFormat="24"
                  style="width: 100%"
                />
              </div>
            </div>

            <div class="form-footer">
              <button class="cancel-btn" @click="showUserForm = false">Отмена</button>
              <button class="submit-db-btn" @click="submitNewUser">Создать</button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  getCluster,
  getDatabases,
  getDatabasesUsers,
  createDatabase,
  deleteDatabase,
  createDatabaseUser,
} from '@/utils/api';
import { useRenderStore } from '@/stores';
import { storeToRefs } from 'pinia';
import TableComponent from '../TableComponent.vue';
import Dropdown from 'primevue/dropdown';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { ResponseCluster, CreateDatabaseRequest } from '@/types/api';
import type { ClusterUser, CreateDatabaseUser } from '@/types/entities';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import MultiSelect from 'primevue/multiselect';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';

const props = defineProps<{
  workspaceId: number;
  moduleId: number;
}>();

const store = useRenderStore();
const { singleClusters } = storeToRefs(store);

const expandedInfo = ref(true);
const expandedDatabases = ref(true);
const expandedUsers = ref(true);
const showAddForm = ref(false);
const showUserForm = ref(false);

const loading = ref(true);
const cluster = ref<ResponseCluster | null>(null);
const databases = ref<string[]>([]);
const users = ref<ClusterUser[]>([]);

const newDatabase = ref<CreateDatabaseRequest>({
  database: '',
  owner: '',
  lcCollate: '',
  lcCtype: '',
});

const newUser = ref<CreateDatabaseUser>({
  username: '',
  password: '',
  database: '',
  roles: [],
  expiryDate: '',
});

const newDbLabels: Record<keyof CreateDatabaseRequest, string> = {
  database: 'Имя базы данных',
  owner: 'Владелец',
  lcCollate: 'lcCollate',
  lcCtype: 'lcCtype',
};
const availableRoles = ref<string[]>(['pg_monitor', 'read', 'write', 'admin']);

watch(
  () => singleClusters.value[props.moduleId],
  async (newClusterId) => {
    if (!newClusterId) return;
    loading.value = true;
    try {
      cluster.value = await getCluster(props.workspaceId, newClusterId);
      databases.value = await getDatabases(props.workspaceId, newClusterId);
      users.value = await getDatabasesUsers(props.workspaceId, newClusterId);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    } finally {
      loading.value = false;
    }
  },
  { immediate: true },
);

const displayData = computed(() => {
  if (!cluster.value) return {};
  return {
    'Системное имя': cluster.value.systemName,
    'Имя базы данных': cluster.value.databaseName,
    Владелец: cluster.value.ownerName,
    'Версия PostgreSQL': 'v' + cluster.value.majorVersion,
    'Размер хранилища': `${cluster.value.storageSize} GB`,
    CPU: cluster.value.cpu,
    Память: `${cluster.value.memory} MB`,
    Инстансы: cluster.value.instances,
    LC_COLLATE: cluster.value.lcCollate,
    LC_CTYPE: cluster.value.lcCtype,
    'Pooler Mode': cluster.value.poolerMode,
    'Max Connections': cluster.value.poolerMaxConnections,
    'Default Pool Size': cluster.value.poolerDefaultPoolSize,
    'Метод бэкапа': cluster.value.backupMethod,
    'Cron расписание бэкапа': cluster.value.backupScheduleCronExpression,
  };
});

function getStatusInfo(status: number) {
  switch (status) {
    case 0:
      return { label: 'Запускается', class: 'status-blue' };
    case 1:
      return { label: 'Перезагружается', class: 'status-yellow' };
    case 2:
      return { label: 'Запущен', class: 'status-green' };
    default:
      return { label: 'Неизвестно', class: 'status-gray' };
  }
}

async function submitNewDatabase() {
  const { database, owner, lcCollate, lcCtype } = newDatabase.value;
  if (!database || !owner || !lcCollate || !lcCtype) {
    alert('Пожалуйста, заполните все поля');
    return;
  }

  if (!cluster.value) {
    alert('Кластер не загружен');
    return;
  }

  try {
    await createDatabase(props.workspaceId, cluster.value.id, newDatabase.value);
    databases.value = await getDatabases(props.workspaceId, cluster.value.id);
    newDatabase.value = { database: '', owner: '', lcCollate: '', lcCtype: '' };
    showAddForm.value = false;
  } catch (error) {
    console.error('Ошибка при создании базы:', error);
    alert('Не удалось создать базу данных');
  }
}

async function submitNewUser() {
  if (!newUser.value.username || !newUser.value.password || !newUser.value.database) {
    alert('Заполните все обязательные поля');
    return;
  }

  try {
    await createDatabaseUser(props.workspaceId, cluster.value!.id, newUser.value);
    users.value = await getDatabasesUsers(props.workspaceId, cluster.value!.id);
    newUser.value = { username: '', password: '', database: '', roles: [], expiryDate: '' };
    showUserForm.value = false;
  } catch (err) {
    console.error('Ошибка создания пользователя:', err);
    alert('Не удалось создать пользователя');
  }
}

async function deleteDb(databaseName: string) {
  if (!cluster.value) return;
  const confirmed = confirm(`Удалить базу данных "${databaseName}"?`);
  if (!confirmed) return;

  try {
    await deleteDatabase(props.workspaceId, cluster.value.id, databaseName);
    databases.value = await getDatabases(props.workspaceId, cluster.value.id);
  } catch (err) {
    console.error('Ошибка удаления базы:', err);
    alert('Не удалось удалить базу данных');
  }
}

function generatePassword() {
  const length = 12;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
  newUser.value.password = Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
}
</script>

<style scoped lang="scss">
.cluster-details {
  padding-bottom: 40px;
}

.header-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.right-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
}

.toggle-btn {
  background: none;
  border: none;
  font-size: 14px;
  color: #3498db;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #1e87d8;
  }
}

.icon {
  font-size: 18px;
  cursor: pointer;
  color: #3498db;
  transition: color 0.3s ease;
  &:hover {
    color: #1e87d8;
  }
}

.details-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 6px;
  margin-bottom: 6px;

  .label {
    color: #6b7280;
    font-weight: 500;
  }

  .value {
    color: #111827;
    font-weight: 600;
  }
}

.status-green {
  background-color: #28a745;
  color: white;
  padding: 2px 8px;
  border-radius: 6px;
}

.status-yellow {
  background-color: #f0ad4e;
  color: white;
  padding: 2px 8px;
  border-radius: 6px;
}

.status-blue {
  background-color: #3498db;
  color: white;
  padding: 2px 8px;
  border-radius: 6px;
}

.status-gray {
  background-color: #6c757d;
  color: white;
  padding: 2px 8px;
  border-radius: 6px;
}

.db-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  padding: 10px 14px;
  margin-top: 10px;
  border: 1px solid #e0e6ed;
  border-radius: 8px;
}

.db-name {
  font-weight: 500;
  color: #333;
}

.btn-icon {
  background: none;
  border: none;
  padding: 6px;
  border-radius: 50%;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
  font-size: 14px;

  &.red {
    color: #e74c3c;

    &:hover {
      background-color: rgba(231, 76, 60, 0.12);
      transform: scale(1.1);
    }
  }
}

.db-card-form {
  background: #ffffff;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #dcdfe3;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.db-card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.db-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.db-field label {
  display: block;
  font-weight: 500;
  font-size: 13px;
  margin-bottom: 4px;
  color: #555;
}

.db-field input {
  width: 100%;
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}
.db-dropdown :deep(.p-dropdown) {
  width: 100%;
  min-width: 0;
}
.form-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn,
.submit-db-btn {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: #333;
}

.cancel-btn:hover {
  background-color: #d4d4d4;
}

.submit-db-btn {
  background-color: #3498db;
  color: white;
}

.submit-db-btn:hover {
  background-color: #267ac8;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.loading-text {
  color: #666;
  font-size: 14px;
  padding-left: 2px;
  margin-top: 6px;
}
.p-password-input {
  width: 100% !important;
}
.password-with-button {
  display: flex;
  gap: 8px;
  align-items: center;

  .p-password {
    flex: 1;
  }
}
</style>
<style>
.p-password-input {
  width: 100% !important;
}
</style>
