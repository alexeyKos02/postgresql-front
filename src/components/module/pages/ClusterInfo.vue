<template>
  <div class="cluster-details">
    <!-- 📌 Плавающая кнопка открытия мониторинга -->
    <div
  class="floating-button"
  v-if="!showResourcePanel && store.isFull"
  @click="showResourcePanel = true"
  v-tooltip="'Мониторинг ресурсов'"
>
  <FontAwesomeIcon icon="fa-solid fa-microchip" />
</div>

<!-- 📊 Плавающая панель мониторинга ресурсов -->
<transition name="slide-right">
  <div v-if="showResourcePanel" class="resource-floating-panel">
    <div class="resource-panel-header">
      <span>Мониторинг ресурсов</span>
      <button class="close-panel-btn" @click="showResourcePanel = false">
        <FontAwesomeIcon icon="fa-solid fa-circle-xmark" />
      </button>
    </div>
    <div v-if="loadingResources" class="loading-text">Загрузка...</div>
    <div v-else class="resources-grid">
      <div v-for="(resource, index) in monitoringResources" :key="index" class="resource-card">
        <div class="resource-title">{{ resource.pod }}</div>
        <div class="resource-knobs">
          <div class="knob-wrapper">
            <AnimatedKnob :targetValue="resource.cpuUsage * 100" :size="100" />
            <div class="knob-label">CPU</div>
          </div>
          <div class="knob-wrapper">
            <AnimatedKnob :targetValue="resource.memoryUsage * 100" :size="100" />
            <div class="knob-label">Memory</div>
          </div>
          <div class="knob-wrapper">
            <AnimatedKnob :targetValue="resource.storageUsage * 100" :size="100" />
            <div class="knob-label">Storage</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</transition>

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
        <div class="icon" @click="showAddForm = !showAddForm" v-if="user.role !== 'Viewer'">
          <FontAwesomeIcon icon="fa-solid fa-plus" />
        </div>
        <button class="toggle-btn" @click="expandedDatabases = !expandedDatabases">
          {{ expandedDatabases ? 'Скрыть' : 'Показать' }}
        </button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="expandedDatabases">
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

        <TableComponent :databases="databases" :functions="[deleteDb]" />
      </div>
    </transition>

    <!-- Пользователи -->
    <div class="header-toggle" style="margin-top: 32px">
      <h1 class="page-title">Пользователи</h1>
      <div class="right-controls">
        <div class="icon" @click="showUserForm = !showUserForm" v-if="user.role !== 'Viewer'">
          <FontAwesomeIcon icon="fa-solid fa-plus" />
        </div>
        <button class="toggle-btn" @click="expandedUsers = !expandedUsers">
          {{ expandedUsers ? 'Скрыть' : 'Показать' }}
        </button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="expandedUsers">
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
                <div class="password-field-with-icon">
                  <Password v-model="newUser.password" toggleMask style="width: 100%" />
                  <i
                    class="pi pi-key password-icon"
                    v-tooltip="'Сгенерировать пароль'"
                    @click="generatePassword"
                  />
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
                  :modelValue="newUser.expiryDate ? new Date(newUser.expiryDate) : null"
                  @update:modelValue="
                    (value) =>
                      (newUser.expiryDate = value instanceof Date ? value.toISOString() : '')
                  "
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

        <TableComponent :clusterUsers="users" :functions="[deleteUser]" />
      </div>
    </transition>

    <!-- Мониторинг -->
    <div class="header-toggle">
      <h1 class="page-title">Мониторинг</h1>
      <button class="toggle-btn" @click="expandedMonitoring = !expandedMonitoring">
        {{ expandedMonitoring ? 'Скрыть' : 'Показать' }}
      </button>
    </div>

    <transition name="fade">
      <div v-if="expandedMonitoring && dashboardUrl" class="monitoring-iframe-wrapper">
        <iframe
          :src="dashboardUrl"
          width="100%"
          height="700"
          frameborder="0"
          class="grafana-iframe"
        />
      </div>
    </transition>
    <!-- Топ запросов -->
    <div class="header-toggle" style="margin-top: 32px">
      <h1 class="page-title">Мониторинг запросов</h1>
      <button class="toggle-btn" @click="expandedQueries = !expandedQueries">
        {{ expandedQueries ? 'Скрыть' : 'Показать' }}
      </button>
    </div>

    <transition name="fade">
      <div v-if="expandedQueries" class="details-card">
        <div v-if="loadingQueries">
          <div class="query-skeletons">
            <Skeleton v-for="n in 5" :key="n" height="40px" class="skeleton-row" />
          </div>
        </div>
        <div v-else>
          <!-- Поиск -->
          <div class="query-search-wrapper">
            <InputText v-model="querySearch" placeholder="Поиск по SQL..." class="query-search" />
          </div>

          <div class="query-export-buttons">
            <Button
              label="CSV"
              icon="pi pi-file-excel"
              severity="success"
              outlined
              class="pretty-export-btn"
              @click="exportToCSV"
            />
            <Button
              label="JSON"
              icon="pi pi-code"
              severity="info"
              outlined
              class="pretty-export-btn"
              @click="exportToJSON"
            />
          </div>

          <!-- Таблица запросов -->
          <table class="monitor-table">
            <thead>
              <tr>
                <th>Запрос</th>
                <th>Всего вызовов</th>
                <th>Среднее время</th>
                <th>Ст. отклонение</th>
                <th>Количество строк</th>
                <th>Shared Hit</th>
                <th>Shared Read</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(query, index) in filteredQueries" :key="index">
                <td class="query-cell">
                  <button
                    class="copy-btn"
                    @click.stop="copyQuery(query.query)"
                    v-tooltip="'Скопировать запрос'"
                  >
                    <FontAwesomeIcon icon="fa-solid fa-copy" />
                  </button>
                  <div class="query-preview">
                    <span
                      class="query-text"
                      :class="{ 'is-expandable': isExpandable(query.query) }"
                      @click="toggleQuery(index)"
                    >
                      <transition v-if="isExpandable(query.query)" name="query-slide">
                        <pre v-if="expandedQueriesIndex.includes(index)">
    {{ query.query }}
  </pre
                        >
                        <pre v-else>
    {{ getShortQuery(query.query) }}
  </pre
                        >
                      </transition>

                      <pre v-else>
  {{ query.query }}
</pre
                      >
                    </span>
                    <button
                      v-if="isExpandable(query.query)"
                      class="expand-btn"
                      @click.stop="toggleQuery(index)"
                    >
                      <FontAwesomeIcon
                        :icon="
                          expandedQueriesIndex.includes(index)
                            ? 'fa-solid fa-chevron-up'
                            : 'fa-solid fa-chevron-down'
                        "
                      />
                    </button>
                  </div>
                </td>
                <td>{{ query.calls }}</td>
                <td>{{ query.meanExecTime.toFixed(2) }} ms</td>
                <td>{{ query.stddevExecTime.toFixed(2) }} ms</td>
                <td>{{ query.rows }}</td>
                <td>{{ query.sharedBlocksHit }}</td>
                <td>{{ query.sharedBlocksRead }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </transition>
    <!-- Deadlocks -->
    <div class="header-toggle" style="margin-top: 32px">
      <h1 class="page-title">Deadlocks</h1>
      <button class="toggle-btn" @click="expandedDeadlocks = !expandedDeadlocks">
        {{ expandedDeadlocks ? 'Скрыть' : 'Показать' }}
      </button>
    </div>

    <transition name="fade">
      <div v-if="expandedDeadlocks">
        <div v-if="loadingDeadlocks" class="loading-text">Загрузка...</div>
        <div class="table-scroll">
          <TableComponent :deadlocks="deadlocks" />
        </div>
      </div>
    </transition>

    <div class="header-toggle" style="margin-top: 32px">
      <h1 class="page-title">Replication Hosts</h1>
      <div class="right-controls">
        <div class="icon" @click="handleAddReplicationHost" v-if="user.role !== 'Viewer'">
          <FontAwesomeIcon icon="fa-solid fa-plus" />
        </div>
        <div
          class="icon"
          @click="expandedReplicationSettings = !expandedReplicationSettings"
          v-if="user.role !== 'Viewer'"
        >
          <FontAwesomeIcon icon="fa-solid fa-gear" />
        </div>
        <button class="toggle-btn" @click="expandedReplicationHosts = !expandedReplicationHosts">
          {{ expandedReplicationHosts ? 'Скрыть' : 'Показать' }}
        </button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="expandedReplicationSettings">
        <div class="details-card">
          <div class="db-form-grid">
            <div class="db-field">
              <label>Количество синхронных реплик</label>
              <InputText
                :modelValue="replicationSettings.syncReplicas.toString()"
                @update:modelValue="(val) => (replicationSettings.syncReplicas = Number(val))"
                type="number"
              />
            </div>
            <div class="db-field">
              <label>Устойчивость данных</label>
              <Dropdown
                v-model="replicationSettings.dataDurability"
                :options="['preferred', 'required']"
              />
            </div>
          </div>
          <div class="form-footer">
            <button class="submit-db-btn" @click="saveReplicationSettings">Сохранить</button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="expandedReplicationHosts">
        <div v-if="loadingReplicationHosts" class="loading-text">Загрузка...</div>
        <div v-else class="table-scroll">
          <TableComponent :replicationHosts="replicationHosts" />
        </div>
      </div>
    </transition>

    <!-- Бэкапы -->
    <div class="header-toggle" style="margin-top: 32px" v-if="user.role !== 'Viewer'">
      <h1 class="page-title">Резервное копирование</h1>
      <div class="right-controls">
        <div class="icon" @click="showBackupForm = !showBackupForm">
          <FontAwesomeIcon icon="fa-solid fa-database" v-tooltip="'Создать бэкап'" />
        </div>
        <div class="icon" @click="showScheduleForm = !showScheduleForm">
          <FontAwesomeIcon icon="fa-solid fa-clock" v-tooltip="'Настроить расписание'" />
        </div>
        <div
          class="icon"
          @click="showRecoveryForm = !showRecoveryForm"
          v-if="user.role === 'Admin'"
        >
          <FontAwesomeIcon icon="fa-solid fa-rotate-left" v-tooltip="'Восстановление из бэкапа'" />
        </div>
        <button class="toggle-btn" @click="expandedBackup = !expandedBackup">
          {{ expandedBackup ? 'Скрыть' : 'Показать' }}
        </button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="expandedBackup">
        <div v-if="loadingBackups" class="loading-text">Загрузка резервных копий...</div>
        <div v-else class="table-scroll">
          <TableComponent :backups="backups" />
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="showBackupForm" class="db-card-form">
        <div class="db-card-title">Создать резервную копию</div>
        <div class="db-form-grid">
          <div class="db-field">
            <label>Метод</label>
            <Dropdown
              v-model="newBackup.method"
              :options="['volumeSnapshot', 'barmanObjectStore']"
            />
          </div>
        </div>
        <div class="form-footer">
          <button class="cancel-btn" @click="showBackupForm = false">Отмена</button>
          <button class="submit-db-btn" @click="submitBackup">Создать</button>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="showScheduleForm" class="db-card-form">
        <div class="db-card-title">Настроить расписание бэкапов</div>
        <div class="db-form-grid schedule-form-grid">
          <div class="db-field">
            <label>Cron выражение</label>
            <CronPresetSelector v-model="schedule.cronExpression" />
          </div>
          <div class="db-field">
            <label>Метод</label>
            <Dropdown
              v-model="schedule.method"
              :options="['volumeSnapshot', 'barmanObjectStore']"
            />
          </div>
        </div>
        <div class="form-footer">
          <button class="cancel-btn" @click="showScheduleForm = false">Отмена</button>
          <button class="submit-db-btn" @click="submitSchedule">Сохранить</button>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="showRecoveryForm" class="db-card-form">
        <div class="db-card-title">Восстановить из бэкапа</div>
        <div class="db-form-grid">
          <div class="db-field">
            <label>Имя бэкапа</label>
            <Dropdown
              v-model="recovery.backupName"
              :options="backups.map((b) => b.status.backupName)"
              placeholder="Выберите бэкап"
              :filter="true"
              style="width: 100%"
            />
          </div>
        </div>
        <div class="form-footer">
          <button class="cancel-btn" @click="showRecoveryForm = false">Отмена</button>
          <button class="submit-db-btn" @click="submitRecovery">Восстановить</button>
        </div>
      </div>
    </transition>

    <!-- Мониторинг ресурсов -->
    <div class="header-toggle" style="margin-top: 32px" v-if="!store.isFull">
      <h1 class="page-title">Мониторинг ресурсов</h1>
      <button class="toggle-btn" @click="expandedResources = !expandedResources">
        {{ expandedResources ? 'Скрыть' : 'Показать' }}
      </button>
    </div>

    <transition name="fade">
      <div v-if="expandedResources" class="details-card">
        <div v-if="loadingResources" class="loading-text">Загрузка...</div>
        <div v-else class="resources-grid">
          <div v-for="(resource, index) in monitoringResources" :key="index" class="resource-card">
            <div class="resource-title">{{ resource.pod }}</div>
            <div class="resource-knobs">
              <div class="knob-wrapper">
                <AnimatedKnob :targetValue="resource.cpuUsage * 100" :size="100" />
                <div class="knob-label">CPU</div>
              </div>
              <div class="knob-wrapper">
                <AnimatedKnob :targetValue="resource.memoryUsage * 100" :size="100" />
                <div class="knob-label">Memory</div>
              </div>
              <div class="knob-wrapper">
                <AnimatedKnob :targetValue="resource.storageUsage * 100" :size="100" />
                <div class="knob-label">Storage</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import {
  getCluster,
  getDatabases,
  getDatabasesUsers,
  createDatabase,
  deleteDatabase,
  createDatabaseUser,
  getDatabasesRoles,
  getMonitoringDashboard,
  getMonitoringTopQueries,
  getMonitoringDeadlocks,
  getReplicationHosts,
  updateReplicationSettings,
  postReplicationHosts,
  recoverFromBackup,
  scheduleBackup,
  createBackup,
  getBackup,
  deleteDatabaseUser,
  getClusterResourceUsage,
} from '@/utils/api';
import { useRenderStore } from '@/stores';
import { storeToRefs } from 'pinia';
import TableComponent from '../TableComponent.vue';
import Dropdown from 'primevue/dropdown';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type {
  ResponseCluster,
  CreateDatabaseRequest,
  TopQueryStat,
  DeadlockStat,
  RecoveryFromBackupRequest,
  CreateBackupRequest,
  BackupScheduleRequest,
  BackupData,
  ClusterResourceUsage,
} from '@/types/api';
import type { ClusterUser, CreateDatabaseUser } from '@/types/entities';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import MultiSelect from 'primevue/multiselect';
import Skeleton from 'primevue/skeleton';
import Calendar from 'primevue/calendar';
import { useToast } from 'primevue';
import CronPresetSelector from '@/components/CronPresetSelector.vue';
import AnimatedKnob from '@/components/AnimatedKnob.vue';

const props = defineProps<{
  workspaceId: number;
  moduleId: number;
}>();

let resourceInterval: ReturnType<typeof setInterval> | null = null;

const toast = useToast();
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
const availableRoles = ref<string[]>([]);

const expandedMonitoring = ref(false);
const dashboardUrl = ref<string | null>(null);

const expandedQueries = ref(false);
const loadingQueries = ref(false);
const topQueries = ref<TopQueryStat[]>([]);

const querySearch = ref('');
const expandedQueriesIndex = ref<number[]>([]);

const expandedDeadlocks = ref(false);
const loadingDeadlocks = ref(false);
const deadlocks = ref<DeadlockStat[]>([]);

const expandedReplicationHosts = ref(false);
const expandedReplicationSettings = ref(false);
const loadingReplicationHosts = ref(false);
const replicationHosts = ref<string[]>([]);
const replicationSettings = ref({
  syncReplicas: Number(cluster.value?.syncReplicas),
  dataDurability: 'preferred',
});
const expandedBackup = ref(false);
const showBackupForm = ref(false);
const showScheduleForm = ref(false);
const showRecoveryForm = ref(false);
const loadingBackups = ref(false);
const backups = ref<BackupData[]>([]);
const newBackup = ref<CreateBackupRequest>({ method: 'stream' });
const schedule = ref<BackupScheduleRequest>({ cronExpression: '', method: 'stream' });
const recovery = ref<RecoveryFromBackupRequest>({ backupName: '' });

const monitoringResources = ref<ClusterResourceUsage[]>([]);
const loadingResources = ref(false);
const expandedResources = ref(false);

const user = computed(() => store.currentUserInfo[store.currentUserInfoId]);

const showResourcePanel = ref(false);

watch(showResourcePanel, async (opened) => {
  if (opened && cluster.value) {
    loadingResources.value = true;
    try {
      monitoringResources.value = await getClusterResourceUsage(
        props.workspaceId,
        cluster.value.id,
      );
    } catch (err) {
      console.error('Ошибка загрузки ресурсов:', err);
      monitoringResources.value = [];
    } finally {
      loadingResources.value = false;
    }

    if (!resourceInterval) {
      resourceInterval = setInterval(async () => {
        try {
          const updatedResources = await getClusterResourceUsage(
            props.workspaceId,
            cluster.value!.id,
          );
          monitoringResources.value = updatedResources;
        } catch (err) {
          console.error('Ошибка обновления ресурсов:', err);
        }
      }, 10000); // каждые 10 секунд
    }
  } else {
    if (resourceInterval) {
      clearInterval(resourceInterval);
      resourceInterval = null;
    }
  }
});

watch(expandedReplicationHosts, async (opened) => {
  if (opened && cluster.value && replicationHosts.value.length === 0) {
    loadingReplicationHosts.value = true;
    try {
      replicationHosts.value = await getReplicationHosts(props.workspaceId, cluster.value.id);
    } catch (err) {
      console.error('Ошибка загрузки replication hosts:', err);
    } finally {
      loadingReplicationHosts.value = false;
    }
  }
});

async function saveReplicationSettings() {
  const maxReplicas = replicationHosts.value.length - 1;
  if (replicationSettings.value.syncReplicas > maxReplicas) {
    toast.add({
      severity: 'warn',
      summary: 'Ошибка валидации',
      detail: `Количество синхронных реплик не корректно`,
      life: 3000,
    });
    return;
  }

  try {
    await updateReplicationSettings(
      props.workspaceId,
      cluster.value!.id,
      replicationSettings.value,
    );
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Настройки репликации сохранены',
      life: 3000,
    });
  } catch (err) {
    console.error('Ошибка сохранения настроек:', err);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось сохранить настройки репликации',
      life: 3000,
    });
  }
}

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

watch(
  () => singleClusters.value[props.moduleId],
  async (newClusterId) => {
    if (!newClusterId) return;
    loading.value = true;
    try {
      cluster.value = await getCluster(props.workspaceId, newClusterId);
      databases.value = await getDatabases(props.workspaceId, newClusterId);
      users.value = await getDatabasesUsers(props.workspaceId, newClusterId);
      store.currentUserInfo[store.currentUserInfoId].cluster = cluster.value.systemName;
      topQueries.value = [];
      loadingQueries.value = true;
      try {
        topQueries.value = await getMonitoringTopQueries(props.workspaceId, newClusterId);
      } catch (e) {
        console.error('Ошибка загрузки top queries:', e);
      }
      loadingQueries.value = false;
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    } finally {
      loading.value = false;
    }
  },
  { immediate: true },
);

// Загрузка ролей при открытии формы создания пользователя
watch(showUserForm, async (visible) => {
  if (visible && cluster.value) {
    try {
      const rolesResponse = await getDatabasesRoles(props.workspaceId, cluster.value.id);
      availableRoles.value = rolesResponse || [];
    } catch (err) {
      console.error('Ошибка загрузки ролей:', err);
      availableRoles.value = [];
    }
  }
});

watch(expandedMonitoring, async (opened) => {
  if (opened && cluster.value && !dashboardUrl.value) {
    try {
      const { link } = await getMonitoringDashboard(props.workspaceId, cluster.value.id);
      dashboardUrl.value = link;
    } catch (err) {
      console.error('Ошибка загрузки Grafana dashboard:', err);
    }
  }
});

watch(expandedDeadlocks, async (opened) => {
  if (opened && cluster.value && deadlocks.value.length === 0) {
    loadingDeadlocks.value = true;
    try {
      deadlocks.value = await getMonitoringDeadlocks(props.workspaceId, cluster.value.id);
    } catch (err) {
      console.error('Ошибка загрузки deadlocks:', err);
      deadlocks.value = [];
    } finally {
      loadingDeadlocks.value = false;
    }
  }
});

watch(expandedBackup, async (visible) => {
  if (visible && cluster.value) {
    loadingBackups.value = true;
    try {
      backups.value = await getBackup(props.workspaceId, cluster.value.id);
    } catch (err) {
      console.error('Ошибка загрузки backup list:', err);
    } finally {
      loadingBackups.value = false;
    }
  }
});

watch(expandedResources, async (opened) => {
  if (opened && cluster.value && monitoringResources.value.length === 0) {
    loadingResources.value = true;
    try {
      monitoringResources.value = await getClusterResourceUsage(
        props.workspaceId,
        cluster.value.id,
      );
    } catch (err) {
      console.error('Ошибка загрузки ресурсов:', err);
      monitoringResources.value = [];
    } finally {
      loadingResources.value = false;
    }
  }
});

watch(expandedResources, async (opened) => {
  if (opened && cluster.value) {
    loadingResources.value = true;
    try {
      monitoringResources.value = await getClusterResourceUsage(
        props.workspaceId,
        cluster.value.id,
      );
    } catch (err) {
      console.error('Ошибка загрузки ресурсов:', err);
      monitoringResources.value = [];
    } finally {
      loadingResources.value = false;
    }

    // Запускаем периодическую подгрузку
    if (!resourceInterval) {
      resourceInterval = setInterval(async () => {
        try {
          const updatedResources = await getClusterResourceUsage(
            props.workspaceId,
            cluster.value!.id,
          );
          monitoringResources.value = updatedResources;
        } catch (err) {
          console.error('Ошибка обновления ресурсов:', err);
        }
      }, 1000); // каждые 10 секунд
    }
  } else {
    // Если закрыли секцию - останавливаем интервал
    if (resourceInterval) {
      clearInterval(resourceInterval);
      resourceInterval = null;
    }
  }
});

onUnmounted(() => {
  if (resourceInterval) {
    clearInterval(resourceInterval);
    resourceInterval = null;
  }
  store.currentUserInfo[store.currentUserInfoId].cluster = '';
});

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
const filteredQueries = computed(() =>
  topQueries.value.filter((q) => q.query.toLowerCase().includes(querySearch.value.toLowerCase())),
);
const handleAddReplicationHost = async () => {
  if (!cluster.value) return;
  try {
    await postReplicationHosts(props.workspaceId, cluster.value.id);
    replicationHosts.value = await getReplicationHosts(props.workspaceId, cluster.value.id);
    toast.add({
      severity: 'success',
      summary: 'Хост добавлен',
      detail: 'Новый репликационный хост успешно добавлен',
      life: 3000,
    });
  } catch (err) {
    console.error('Ошибка добавления хоста:', err);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось добавить хост',
      life: 3000,
    });
  }
};
function toggleQuery(index: number) {
  const i = expandedQueriesIndex.value.indexOf(index);
  if (i !== -1) {
    expandedQueriesIndex.value.splice(i, 1);
  } else {
    expandedQueriesIndex.value.push(index);
  }
}

function isExpandable(query: string): boolean {
  return query.length > 120;
}

function getShortQuery(query: string): string {
  return query.length > 120 ? query.slice(0, 120) + '...' : query;
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
async function deleteUser(username: string) {
  if (!cluster.value) return;
  const confirmed = confirm(`Удалить пользователя "${username}"?`);
  if (!confirmed) return;

  try {
    await deleteDatabaseUser(props.workspaceId, cluster.value.id, username);
    users.value = await getDatabasesUsers(props.workspaceId, cluster.value.id);
    toast.add({
      severity: 'success',
      summary: 'Пользователь удалён',
      life: 3000,
    });
  } catch (err) {
    console.error('Ошибка при удалении пользователя:', err);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось удалить пользователя',
      life: 3000,
    });
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
function copyQuery(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => {})
    .catch((err) => {
      console.error('Ошибка копирования:', err);
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Не удалось скопировать',
        life: 3000,
      });
    });
}

function exportToCSV() {
  const header = [
    'Запрос',
    'Всего вызовов',
    'Среднее время',
    'Ст. отклонение',
    'Строк',
    'Shared Hit',
    'Shared Read',
  ];
  const rows = filteredQueries.value.map((q) => [
    `"${q.query.replace(/"/g, '""')}"`,
    q.calls,
    q.meanExecTime,
    q.stddevExecTime,
    q.rows,
    q.sharedBlocksHit,
    q.sharedBlocksRead,
  ]);
  const csvContent = [header, ...rows].map((e) => e.join(',')).join('\n');
  downloadFile(csvContent, 'top_queries.csv', 'text/csv');
}

function exportToJSON() {
  const json = JSON.stringify(filteredQueries.value, null, 2);
  downloadFile(json, 'top_queries.json', 'application/json');
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

async function submitBackup() {
  try {
    await createBackup(props.workspaceId, cluster.value!.id, newBackup.value);
    backups.value = await getBackup(props.workspaceId, cluster.value!.id);
    toast.add({ severity: 'success', summary: 'Бэкап создан', life: 3000 });
    showBackupForm.value = false;
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Ошибка создания бэкапа', life: 3000 });
  }
}

async function submitSchedule() {
  try {
    await scheduleBackup(props.workspaceId, cluster.value!.id, schedule.value);
    toast.add({ severity: 'success', summary: 'Расписание сохранено', life: 3000 });
    showScheduleForm.value = false;
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Ошибка сохранения расписания', life: 3000 });
  }
}

async function submitRecovery() {
  try {
    await recoverFromBackup(props.workspaceId, cluster.value!.id, recovery.value);
    toast.add({ severity: 'success', summary: 'Восстановление начато', life: 3000 });
    showRecoveryForm.value = false;
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Ошибка восстановления', life: 3000 });
  }
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
  margin-bottom: 12px;
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
  margin: 24px 0;
  padding: 20px;
  border: 1px solid #dcdfe3;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  animation: fadeInUp 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.password-field-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;

  .password-icon {
    font-size: 1.2rem;
    color: #3498db;
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: #1c78b8;
    }
  }
}
.monitoring-iframe-wrapper {
  margin-top: 20px;
  border: 1px solid #dcdfe3;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  iframe {
    border: none;
    width: 100%;
    height: 700px;
  }
}
.monitor-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;

  th,
  td {
    padding: 10px;
    border: 1px solid #e5e7eb;
    text-align: left;
    font-size: 13px;
  }

  th {
    background-color: #f9fafb;
    font-weight: 600;
  }

  pre {
    margin: 0;
    font-family: monospace;
    font-size: 12px;
    white-space: pre-wrap;
  }
}
.query-search-wrapper {
  margin-bottom: 12px;
}

.query-search {
  width: 300px;
  padding: 6px 10px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
}

.query-cell {
  position: relative;
  padding-right: 40px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f4f4f4;
  }

  .query-preview {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;

    .query-text {
      flex-grow: 1;
      white-space: pre-wrap;
      font-family: monospace;
      cursor: default;
    }

    .is-expandable {
      cursor: pointer;
      transition: color 0.2s;
      &:hover {
        color: #1f6feb;
      }
    }

    .expand-btn {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      font-size: 12px;
      color: #3498db;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.1);
        color: #1e87d8;
      }
    }
  }
}
.copy-btn {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  color: #888;
  margin-left: 4px;
  transition: color 0.2s ease;

  &:hover {
    color: #1f6feb;
  }
}
.query-export-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  margin-top: 8px;
}

.pretty-export-btn {
  border-radius: 10px !important;
  padding: 0.5rem 1.2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  .pi {
    font-size: 1rem;
  }
}
.query-skeletons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.skeleton-row {
  border-radius: 8px;
}
.table-scroll {
  margin-top: 16px;
  overflow-x: auto;
  width: 100%;
  max-width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
.schedule-form-grid {
  grid-template-columns: repeat(2, 1fr);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}
.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.resource-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.resource-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 16px;
  color: #1f2937;
}

.resource-knobs {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.knob-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;

  .knob-label {
    margin-top: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
  }
}
/* 📌 Плавающая кнопка слева */
.floating-button {
  position: fixed;
  top: 250px;
  left: 10px;
  width: 48px;
  height: 48px;
  background-color: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1500;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
}

/* 📊 Плавающая панель мониторинга */
.resource-floating-panel {
  position: fixed;
  top: 12vh;
  left: 0;
  width: 400px;
  height: 80vh;
  background: white;
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.15);
  padding: 20px;
  overflow-y: auto;
  z-index: 1400;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 90%; /* на мобильных будет ширина 90% */
  }
}

/* 📽 Анимация появления слева */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(-100%); /* Было 100%, меняем на -100% */
  opacity: 0;
}

/* 📋 Заголовок панели */
.resource-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 20px;
}

/* ❌ Кнопка закрытия панели */
.close-panel-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #3498db; /* синий цвет системы */
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #267ac8; /* чуть темнее при наведении */
  }
}
</style>

<style>
.p-inputtext {
  width: 100% !important;
}
</style>
